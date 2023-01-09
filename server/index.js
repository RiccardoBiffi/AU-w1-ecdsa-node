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
  // Private key: 3b598eafb427a7c65557743f16c9575e1865834a993d704fdf811934c30ed0ef
  "0x69f0cd1939ca39f87a4cc87e6127515f47ce852c": 100,
  // Private key: d82cb8df49b4c9ab074fe63435e35b1fdfe872bd96a5a9dca4896715376b7830
  "0x45a4e9fed5c20ad90026919612672886dc620bc4": 50,
  // Private key: a8f54abe4e787868490ea7b7b8ff00b2074572f4481149f6d5e9db741e1f4a3f
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
