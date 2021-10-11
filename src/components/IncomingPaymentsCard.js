import { ethers } from "ethers";
import { useEffect, useCallback, useState } from "react";
import { usePayouts } from "../providers/PayoutsProvider";

function IncomingPaymentsCard() {
  const payouts = usePayouts();
  const [balance, setBalance] = useState();

  const getBalance = useCallback(async () => {
    try {
      const userBalance = await payouts.getBalance();
      let res = ethers.utils.formatEther(userBalance);
      res = Math.round(res * 1e4) / 1e4;
      setBalance(res);
    } catch (err) {
      console.log("Error: ", err)
    }
  }, [payouts]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const withdraw = async () => {
    const transaction = await payouts.withdraw();
    await transaction.wait();
    getBalance();
  } 

  return (
    <div className="Card">
      <h2>Incoming payments</h2>
      <p>{balance >= 0 && balance} ETH</p>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  )
}
    
export default IncomingPaymentsCard;