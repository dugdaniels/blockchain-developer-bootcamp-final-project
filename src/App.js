import { useEthereum } from "./providers/EthereumProvider";
import { usePayouts } from "./providers/PayoutsProvider";
import "./App.css";

function App() {
  const { address } = useEthereum();
  const payouts = usePayouts();

  return (
    <div className="App">
      {address ? 
        <>
          <p>Wallet address: {address}</p>
          <p>Contract address: {payouts.address}</p>
        </>
      : null}
    </div>
  );
}

export default App;
