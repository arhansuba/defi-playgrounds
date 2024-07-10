
import { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          const networkId = await web3Instance.eth.net.getId();
          setNetworkId(networkId);
          const contractInstance = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          setContract(contractInstance);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('No Ethereum provider detected');
      }
    };
    initWeb3();
  }, []);

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const switchNetwork = async (networkId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${networkId.toString(16)}` }],
      });
      setNetworkId(networkId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        account,
        networkId,
        contract,
        connectWallet,
        switchNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Provider, Web3Context };