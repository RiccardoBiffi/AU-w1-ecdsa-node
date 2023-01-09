import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { sign } from "ethereum-cryptography/secp256k1";

export function hashMessage(message) {
    const bytes = utf8ToBytes(message)
    return keccak256(bytes)
}

export async function signMessage(msg, privateKey) {
    console.log(msg, privateKey)
    const hasedMsg = hashMessage(msg)
    return sign(hasedMsg, privateKey, { recovered: true })
}
