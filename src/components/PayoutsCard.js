import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useEthereum } from "../providers/EthereumProvider";
import { usePayouts } from "../providers/PayoutsProvider";

function PayoutsCard({ paymentInputValue, setPaymentInputValue }) {
  const { signer } = useEthereum();
  const payouts = usePayouts();
  const [error, setError] = useState();

  useEffect(() => {
    setError('');
  }, [paymentInputValue]);
  
  const sendPayment = async () => {
    try {
      if (!paymentInputValue || paymentInputValue <= 0) {
        throw new Error("Error: You must provide an amount.")
      }
      const transaction = await signer.sendTransaction({
          to: payouts.address,
          value: ethers.utils.parseEther(paymentInputValue)
      });
      await transaction.wait();
      setPaymentInputValue("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="Card">
      <h2>Send payment to split</h2>
      <label>Amount</label>
      <input type="number" value={paymentInputValue} onChange={e => setPaymentInputValue(e.target.value)} placeholder="Enter payment amount in ETH..." />
      {error && <div className="Error">{error}</div>}
      <button onClick={sendPayment}>Send</button>
    </div>
  )
}
    
export default PayoutsCard;