// frontend/src/pages/PaymentPage.js
import React, { useContext, useState } from 'react';
import { Web3Context } from '../../contexts/Web3Context';

function PaymentPage() {
  const { web3 } = useContext(Web3Context);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const handleAmountChange = event => {
    setAmount(event.target.value);
  };

  const handleMakePayment = async () => {
    try {
      const paymentInstance = new web3.eth.Contract(
        Payment.abi,
        Payment.networks[await web3.eth.net.getId()].address,
      );
      await paymentInstance.methods.makePayment(account, amount).send({ from: account });
      setPaymentSuccess(true);
    } catch (error) {
      setPaymentError(error.message);
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <p>Account: {account}</p>
      <p>Balance: {balance}</p>
      <form>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={handleAmountChange} />
        <br />
        <button type="button" onClick={handleMakePayment}>Make Payment</button>
        {paymentError && <p style={{ color: 'red' }}>{paymentError}</p>}
        {paymentSuccess && <p style={{ color: 'green' }}>Payment successful!</p>}
      </form>
    </div>
  );
}

export default PaymentPage;