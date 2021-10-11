import { ethers } from "ethers";
import { useEthereum } from "./providers/EthereumProvider";
import { usePayouts } from "./providers/PayoutsProvider";
import { useEffect, useCallback, useState } from "react";
import "./App.css";
import IncomingPaymentsCard from "./components/IncomingPaymentsCard";

function App() {
  const { address, signer } = useEthereum();
  const payouts = usePayouts();

  const [payees, setPayees] = useState([]);
  const [totalSplit, setTotalSplit] = useState();
  const [addressInputValue, setAddressInputValue] = useState();
  const [splitInputValue, setSplitInputValue] = useState();
  const [paymentInputValue, setPaymentInputValue] = useState("");

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

  useEffect(() => {
    let splitCount = 0;
    payees.forEach(payee => {
      splitCount += payee.split.toNumber();
    });
    setTotalSplit(splitCount);
  }, [payees, paymentInputValue]);

  const addPayee = async () => {
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
  
  const sendPayment = async () => {
    const transaction = await signer.sendTransaction({
        to: payouts.address,
        value: ethers.utils.parseEther(paymentInputValue)
    });
    await transaction.wait();
    setPaymentInputValue("");
  }

  const estimatePayment = (totalPayment, split) => 
    totalPayment > 0 ? totalPayment / totalSplit * split : 0;

  return (
    <div className="App">
      {address ? 
        <>
          <div className="CardRow">
            <div className="Card">
              <h2>Add recipient</h2>
              <label>Address</label>
              <input onChange={e => setAddressInputValue(e.target.value)} placeholder="Enter payee address..." />
              <label>Split</label>
              <input onChange={e => setSplitInputValue(e.target.value)} placeholder="Enter payee split..." />
              <button onClick={addPayee}>Add payee</button>
            </div>
            <div className="Card">
              <h2>Send payment to split</h2>
              <label>Amount</label>
              <input type="number" value={paymentInputValue} onChange={e => setPaymentInputValue(e.target.value)} placeholder="Enter payment amount in ETH..." />
              <button onClick={sendPayment}>Send</button>
            </div>
            <IncomingPaymentsCard />
          </div>

          <div className="PayeeCard">
            <h2>Recipients</h2>
            {payees.length > 0 ?   
              <table>
                <thead className="PayeeCard--headers">
                  <tr>
                    <th className="address">Address</th>
                    <th>Split</th>
                    <th>Payout</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {payees.map(payee => 
                    <tr>
                      <td className="address">{payee.accountAddress}</td>
                      <td>{payee.split.toNumber()}</td>
                      <td>{estimatePayment(paymentInputValue, payee.split.toNumber())} ETH</td>
                      <td>
                        <button onClick={() => removePayee(payee.accountAddress)}>Remove</button>
                        <button onClick={() => removePayee(payee.accountAddress)}>Edit</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table> :
              <p>No payees have been added yet</p>
            }
          </div>


        </>
      : null}
    </div>
  );
}

export default App;
