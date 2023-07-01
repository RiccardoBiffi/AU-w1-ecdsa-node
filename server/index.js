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
  "0x49897358dd820a7f31aa23ec18b935f14fa1c2b9": 100, // 41c0ecabf96c940d13270afeafdedac0a21eb732f6a926dbca5edbb155efc967
  "0x34346e4ab50874656bd1ab57be149b4728846c06": 50, // b619e08afe6efda313cd272513fc32e67c326cb1fd897c4953d3d5747e46a4df
  "0xaf1b9801e086ff1d27eb0e53162e42bb4f728f90": 75, // 1af178bc0dd47fdf5828ad017d4d7324db1495a0e8b66f83b9fa5e9d005146ba
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { msgHash, signedMsg, recoveryBit, recipient, amount } = req.body;

  const signature = secp256k1.Signature.fromCompact(signedMsg).addRecoveryBit(recoveryBit)
  const publicKey = signature.recoverPublicKey(msgHash).toRawBytes()
  const sender = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20))

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
