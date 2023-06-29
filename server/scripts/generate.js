const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);
const address = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));

console.log("Private key: ", toHex(privateKey));
console.log("Public key: ", toHex(publicKey));
console.log("Address: ", address);