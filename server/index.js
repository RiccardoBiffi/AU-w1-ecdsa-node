const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const port = 3042;


app.use(cors());
app.use(express.json());

const balances = {
  "0x49897358dd820a7f31aa23ec18b935f14fa1c2b9": 100,
  "0x34346e4ab50874656bd1ab57be149b4728846c06": 50,
  "0xaf1b9801e086ff1d27eb0e53162e42bb4f728f90": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // todo get signature
  // recover public key from signature and address
  const { sender, recipient, amount } = req.body;

  const publicKey = secp.recoverPublicKey(msgHash, signature, recoveryBit);
  const sender = "0x" + toHex(keccak256(publicKey).slice(-20))

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
