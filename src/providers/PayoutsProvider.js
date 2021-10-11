import { ethers } from "ethers";
import { createContext, useContext, useState, useEffect } from "react"; 
import { useEthereum } from "./EthereumProvider";
import Payouts from "../artifacts/contracts/Payouts.sol/Payouts.json";

const CONTRACT_ADDRESS = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

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