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
  "0x69f0cd1939ca39f87a4cc87e6127515f47ce852c": 100,
  "0x45a4e9fed5c20ad90026919612672886dc620bc4": 50,
  "0x9276d5abc064d456cfb638247a4284661d07800a": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { msgHash, signature, recoveryBit, recipient, amount } = req.body;

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
