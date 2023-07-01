import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { getAddress } from "./scripts/crypto-utils";

import server from "./server";


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if (privateKey) {
      const publicKey = secp256k1.getPublicKey(privateKey)
      const address = getAddress(publicKey);
      setAddress(address);
      const {
        data: { accountInfo },
      } = await server.get(`accountInfo/${address}`);
      setBalance(accountInfo.balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Your Private Key
        <input placeholder="Type your Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <label>
        Your derived address
        <input value={address ? address.slice(0, 6) + "..." + address.slice(-4) : ""} title={address} disabled></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
