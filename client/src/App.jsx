import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("41c0ecabf96c940d13270afeafdedac0a21eb732f6a926dbca5edbb155efc967");

  return (
    <div className="app">

      <Wallet
        balance={balance}
        setBalance={setBalance}
        setNonce={setNonce}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />

      <Transfer
        address={address}
        setBalance={setBalance}
        nonce={nonce}
        setNonce={setNonce}
        privateKey={privateKey}
      />

    </div>
  );
}

export default App;
