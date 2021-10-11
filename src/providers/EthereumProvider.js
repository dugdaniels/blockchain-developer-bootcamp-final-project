import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const EthereumContext = createContext();

const EthereumProvider = (props) => {
  const [initialized, setInitialized] = useState(false);
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();

  function updateProvider(provider) {
    setProvider(provider);
    setSigner(provider.getSigner());
  }

  const getAddress = useCallback(async () => {
    const [address] = await provider.send("eth_requestAccounts", []);
    setAddress(address);
  }, [provider]);

  const setInitialProvider = useCallback(() => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      updateProvider(ethers.getDefaultProvider());
    } else {
      updateProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, []);
  
  useEffect(() => {
    setInitialProvider();
    setInitialized(true);
  }, [setInitialProvider]);

  useEffect(() => {;
    if (initialized) getAddress();
  }, [initialized, getAddress]);

  const variables = { provider, signer, address };
  const functions = { setAddress, getAddress }
  const value = { ...variables, ...functions }

  return initialized ? <EthereumContext.Provider value={value} {...props} /> : null;
}

export const useEthereum = () => {
  return useContext(EthereumContext);
}

export default EthereumProvider;