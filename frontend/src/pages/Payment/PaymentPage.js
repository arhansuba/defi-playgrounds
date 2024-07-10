// frontend/src/pages/PaymentPage.js
import React, { useContext, useState } from 'react';
import { Web3Context } from '../../contexts/Web3Context';
import Payment from '../../contracts/Payment.json';

function PaymentPage() {
  const { web3 } = useContext(Web3Context);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);

  const loadBlockchainData = async () => {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Payment.networks[networkId];
    const paymentInstance = new web3.eth.Contract(
      Payment.abi,
      deployedNetwork && deployedNetwork.address,
    );
    const balance = await paymentInstance.methods.balanceOf(accounts[0]).call();
    setBalance(balance);
  };

  useEffect(() => {
    if (web3) {
      loadBlockchainData();
    }
  }, [web3]);

  return (
    <div>
      <h1>Payment Page</h1>
      <p>Account: {account}</p>
      <p>Balance: {balance}</p>
    </div>
  );
}

export default PaymentPage;
