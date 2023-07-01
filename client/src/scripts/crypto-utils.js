import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";


export function getAddress(publicKey) {
    return "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));
}

export function hashMessage(message) {
    return toHex(keccak256(utf8ToBytes(message)))
}

export function buildMessage(sendAmount, recipient, nonce) {
    return `Sending ${sendAmount} to ${recipient} with nonce ${nonce}`;
}

export function signMessage(msg, privateKey) {
    const signedMsg = secp256k1.sign(hashMessage(msg), privateKey)
    return [signedMsg.toCompactHex(), signedMsg.recovery]
}
