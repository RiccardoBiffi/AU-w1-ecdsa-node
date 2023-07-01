import { useState } from "react";
import server from "./server";
import { buildMessage, hashMessage, signMessage } from "./scripts/crypto-utils";

function Transfer({ address, setBalance, nonce, setNonce, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const message = buildMessage(sendAmount, recipient, nonce);
      const [signedMsg, recovery] = signMessage(message, privateKey);

      const { data: { accountInfo } } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: recipient,
        nonce: nonce,
        msgHash: hashMessage(message),
        signedMsg: signedMsg,
        recoveryBit: recovery,
      });

      setBalance(accountInfo.balance);
      setNonce(accountInfo.nonce);

    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="Type an amount, eg: 5"
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, eg: 0x34346e4ab50874656bd1ab57be149b4728846c06"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>

      <div className="balance">Nonce: {nonce}</div>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;


