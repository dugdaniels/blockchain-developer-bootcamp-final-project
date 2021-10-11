import { useEthereum } from "./providers/EthereumProvider";
import { usePayouts } from "./providers/PayoutsProvider";
import { useEffect, useCallback, useState } from "react";
import "./App.css";

function App() {
  const { address } = useEthereum();
  const payouts = usePayouts();

  const [payees, setPayees] = useState([]);
  const [addressInputValue, setAddressInputValue] = useState();
  const [splitInputValue, setSplitInputValue] = useState();

  const getPayees = useCallback(async () => {
    try {
      const payeeList = await payouts.getPayees();
      setPayees(payeeList);
    } catch (err) {
      console.log("Error: ", err)
    }
  }, [payouts]);

  useEffect(() => {
    getPayees();
  }, [getPayees]);

  const addPayee = async (address, split) => {
    try {
      const transaction = await payouts.addPayee(addressInputValue, splitInputValue);
      await transaction.wait();
      setAddressInputValue();
      setSplitInputValue();
      getPayees();
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  const removePayee = async (address) => {
    const transaction = await payouts.removePayee(address);
    await transaction.wait();
    getPayees();
  }


  return (
    <div className="App">
      {address ? 
        <>
          <p>Wallet address: {address}</p>
          <p>Contract address: {payouts.address}</p>
          <input onChange={e => setAddressInputValue(e.target.value)} placeholder="Enter payee address..." />
          <input onChange={e => setSplitInputValue(e.target.value)} placeholder="Enter payee split..." />
          <button onClick={addPayee}>Add payee</button>

          {payees.length > 0 ? 
            payees.map(payee => 
              <p>
                Address: {payee.accountAddress} 
                Split: {payee.split.toNumber()}
                <button onClick={() => removePayee(payee.address)}>Remove</button>
              </p>
            ) :
            <p>No payees have been added yet</p>
          }
        </>
      : null}
    </div>
  );
}

export default App;
