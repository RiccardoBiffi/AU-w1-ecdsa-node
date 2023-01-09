const { toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey()
console.log("Private key: ", toHex(privateKey));

const publickKey = secp.getPublicKey(privateKey);
console.log("Public key: ", toHex(publickKey));

const address = keccak256(publickKey).slice(-20);
console.log("Address: 0x" + toHex(address));