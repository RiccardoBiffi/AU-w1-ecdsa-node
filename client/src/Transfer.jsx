import { useState } from "react";
import server from "./server";
import { toHex } from "ethereum-cryptography/utils";
import { hashMessage, signMessage } from "./scripts/crypto-utils";

function Transfer({ privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const message = `Sending ${sendAmount} to ${recipient}`;
      const [signature, recovery] = signMessage(message, privateKey);

      const { data: { balance } } = await server.post(`send`, {
        msgHash: toHex(hashMessage(message)),
        signedMsg: signature,
        recoveryBit: recovery,
        recipient: recipient,
        amount: parseInt(sendAmount),
      });

      setBalance(balance);

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
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
