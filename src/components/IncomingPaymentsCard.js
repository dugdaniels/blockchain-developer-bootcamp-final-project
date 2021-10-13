import { ethers } from "ethers";
import { useEffect, useCallback, useState } from "react";
import { usePayouts } from "../providers/PayoutsProvider";
import Button from "./Button";

function IncomingPaymentsCard() {
  const payouts = usePayouts();
  const [balance, setBalance] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const getBalance = useCallback(async () => {
    try {
      const userBalance = await payouts.getBalance();
      let res = ethers.utils.formatEther(userBalance);
      res = Math.round(res * 1e4) / 1e4;
      setBalance(res);
    } catch (err) {
      setError(err.message);
    }
  }, [payouts]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const withdraw = async () => {
    setLoading(true);
    try {
      if (balance <= 0) {
        throw new Error("You have no funds to withdraw.")
      }
      const transaction = await payouts.withdraw();
      await transaction.wait();
      getBalance(); 
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  } 

  return (
    <div className="Card">
      <h2>Incoming payments</h2>
      <p>{balance >= 0 && balance} ETH</p>
      {error && <div className="Error">{error}</div>}
      <Button onClick={withdraw} loading={loading}>Withdraw</Button>
    </div>
  )
}
    
export default IncomingPaymentsCard;