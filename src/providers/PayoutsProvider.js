import { ethers } from "ethers";
import { createContext, useContext, useState, useEffect } from "react"; 
import { useEthereum } from "./EthereumProvider";
import Payouts from "../artifacts/contracts/Payouts.sol/Payouts.json";

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const PayoutsContext = createContext();

const PayoutsProvider = (props) => {
  const { signer } = useEthereum();
  const [payouts, setPayouts] = useState()

  useEffect(() => {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Payouts.abi,
      signer
    )
    setPayouts(contract);
  }, [signer])

  return payouts ? <PayoutsContext.Provider value={payouts} {...props} /> : null;
}

export const usePayouts = () => {
  return useContext(PayoutsContext);
}

export default PayoutsProvider;