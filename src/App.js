import { useEthereum } from "./providers/EthereumProvider";
import { usePayouts } from "./providers/PayoutsProvider";
import { useEffect, useCallback, useState } from "react";
import "./App.css";
import EditRecipientsModal from "./components/EditRecipientsModal";
import IncomingPaymentsCard from "./components/IncomingPaymentsCard";
import PayoutsCard from "./components/PayoutsCard";

function App() {
  const { address } = useEthereum();
  const payouts = usePayouts();

  const [payees, setPayees] = useState([]);
  const [totalSplit, setTotalSplit] = useState();
  const [paymentInputValue, setPaymentInputValue] = useState("");
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [payeeInfo, setPayeeInfo] = useState();

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

  const removePayee = async (address) => {
    const transaction = await payouts.removePayee(address);
    await transaction.wait();
    getPayees();
  }  

  const estimatePayment = (totalPayment, split) => 
    totalPayment > 0 ? totalPayment / totalSplit * split : 0;

  const showModal = (payee) => {
    setPayeeInfo(payee);
    setModalIsVisible(true)
  }

  const hideModal = (wasDismissed) => {
    if (wasDismissed) getPayees();
    setModalIsVisible(false);
  }

  return (
    <div className="App">
      {address ? 
        <>
          <div className="CardRow">
            <PayoutsCard setPaymentInputValue={setPaymentInputValue} paymentInputValue={paymentInputValue}/>
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
                    <tr key={payee.accountAddress}>
                      <td className="address">{payee.accountAddress}</td>
                      <td>{payee.split.toNumber()}</td>
                      <td>{estimatePayment(paymentInputValue, payee.split.toNumber())} ETH</td>
                      <td>
                        <button onClick={() => removePayee(payee.accountAddress)}>Remove</button>
                        <button onClick={() => showModal({
                            accountAddress: payee.accountAddress,
                            split: payee.split
                          })}>Edit</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table> :
              <p>No payees have been added yet</p>
            }
            <button onClick={() => showModal(false)}>Add recipient</button>
          </div>
          
          {modalIsVisible && <EditRecipientsModal payeeInfo={payeeInfo} hideModal={hideModal}/>}
        </>
      : null}
    </div>
  );
}

export default App;
