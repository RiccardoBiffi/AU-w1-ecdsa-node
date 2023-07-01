const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const port = 3042;


app.use(cors());
app.use(express.json());

const balances = {
  // 41c0ecabf96c940d13270afeafdedac0a21eb732f6a926dbca5edbb155efc967
  "0x49897358dd820a7f31aa23ec18b935f14fa1c2b9": { balance: 100, nonce: 0 },
  // b619e08afe6efda313cd272513fc32e67c326cb1fd897c4953d3d5747e46a4df
  "0x34346e4ab50874656bd1ab57be149b4728846c06": { balance: 50, nonce: 0 },
  // 1af178bc0dd47fdf5828ad017d4d7324db1495a0e8b66f83b9fa5e9d005146ba
  "0xaf1b9801e086ff1d27eb0e53162e42bb4f728f90": { balance: 75, nonce: 0 },
};

app.get("/accountInfo/:address", (req, res) => {
  const { address } = req.params;
  const accountInfo = balances[address] || { balance: 0, nonce: 0 };
  res.send({ accountInfo: accountInfo });
});

app.post("/send", (req, res) => {
  const { sender, amount, recipient, nonce, msgHash, signedMsg, recoveryBit } = req.body;

  if (isMessageInvalid(msgHash, amount, recipient, nonce))
    return res.status(400).send({ message: "Invalid message!" });

  const [signature, publicKey] = recoverSignatureAndPublicKey(signedMsg, recoveryBit, msgHash)
  if (isSignatureInvalid(signature, msgHash, publicKey))
    return res.status(400).send({ message: "Invalid signature!" })

  if (isSenderInvalid(sender, publicKey))
    return res.status(400).send({ message: "Invalid sender!" })

  setInitialAccountInfo(sender)
  setInitialAccountInfo(recipient)

  if (isNonceInvalid(sender, nonce))
    return res.status(400).send({ message: "Invalid nonce!" })

  if (isBalanceInsufficient(sender, amount))
    return res.status(400).send({ message: "Not enough funds!" })

  balances[sender].balance -= amount
  balances[sender].nonce += 1
  balances[recipient].balance += amount

  res.send({ accountInfo: balances[sender] })
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
});


function setInitialAccountInfo(address) {
  if (!balances[address]) {
    balances[address] = { balance: 0, nonce: 0 };
  }
}

function isMessageInvalid(msgHash, amount, recipient, nonce) {
  const restoredMessage = buildMessage(amount, recipient, nonce)
  return msgHash !== hashMessage(restoredMessage)
}

function recoverSignatureAndPublicKey(signedMsg, recoveryBit, msgHash) {
  const signature = secp256k1.Signature.fromCompact(signedMsg).addRecoveryBit(recoveryBit)
  const publicKey = signature.recoverPublicKey(msgHash).toRawBytes()
  return [signature, publicKey]
}

function isSignatureInvalid(signature, msgHash, publicKey) {
  return !secp256k1.verify(signature, msgHash, publicKey)
}

function isSenderInvalid(sender, publicKey) {
  const restoredAddress = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20))
  return sender !== restoredAddress
}

function isNonceInvalid(sender, nonce) {
  return nonce < balances[sender].nonce
}

function isBalanceInsufficient(sender, amount) {
  return balances[sender].balance < amount;
}

function hashMessage(message) {
  return toHex(keccak256(utf8ToBytes(message)))
}

function buildMessage(sendAmount, recipient, nonce) {
  return `Sending ${sendAmount} to ${recipient} with nonce ${nonce}`;
}