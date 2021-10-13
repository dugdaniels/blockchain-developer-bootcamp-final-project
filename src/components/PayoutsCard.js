import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useEthereum } from "../providers/EthereumProvider";
import { usePayouts } from "../providers/PayoutsProvider";
import Button from "./Button";

function PayoutsCard({ payees, paymentInputValue, setPaymentInputValue }) {
  const { signer } = useEthereum();
  const payouts = usePayouts();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    setError('');
  }, [paymentInputValue]);
  
  const sendPayment = async () => {
    setLoading(true);
    try {
      if (!paymentInputValue || paymentInputValue <= 0) {
        throw new Error("You must provide an amount.")
      }
      if (payees.length === 0) {
        throw new Error("You must add at least one recipient.")
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
    setLoading(false);
  }

  return (
    <div className="Card">
      <h2>Send payment to split</h2>
      <label>Amount</label>
      <input type="number" value={paymentInputValue} onChange={e => setPaymentInputValue(e.target.value)} placeholder="Enter payment amount in ETH..." />
      {error && <div className="Error">{error}</div>}
      <Button onClick={sendPayment} loading={loading}>Send payment</Button>
    </div>
  )
}
    
export default PayoutsCard;