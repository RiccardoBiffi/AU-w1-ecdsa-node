import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { getAddress } from "./scripts/crypto-utils";
import { useEffect } from "react";

import server from "./server";


function Wallet({ address, setAddress, balance, setBalance, setNonce, privateKey, setPrivateKey }) {

  useEffect(() => {
    onChange({ target: { value: privateKey } })
  }, []);

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
      setNonce(accountInfo.nonce)
    } else {
      setBalance(0);
    }
  }

  function generate() {
    const privateKey = toHex(secp256k1.utils.randomPrivateKey())
    setPrivateKey(privateKey);
    onChange({ target: { value: privateKey } });
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Your Private Key
        <input placeholder="Type your Private Key" value={privateKey} onChange={onChange} />
      </label>

      <label>
        Your derived address
        <input value={address} disabled></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <button className="button" onClick={generate}>Generate new Private Key</button>
    </div>
  );
}

export default Wallet;
