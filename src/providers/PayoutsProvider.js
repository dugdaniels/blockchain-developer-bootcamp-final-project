import { ethers } from "ethers";
import { createContext, useContext, useState, useEffect } from "react"; 
import { useEthereum } from "./EthereumProvider";
import Payouts from "../artifacts/contracts/Payouts.sol/Payouts.json";

const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

const PayoutsContext = createContext();

const PayoutsProvider = (props) => {
  const { provider } = useEthereum();
  const [payouts, setPayouts] = useState()

  useEffect(() => {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Payouts.abi,
      provider
    )
    setPayouts(contract);
  }, [provider])

  return payouts ? <PayoutsContext.Provider value={payouts} {...props} /> : null;
}

export const usePayouts = () => {
  return useContext(PayoutsContext);
}

export default PayoutsProvider;