// frontend/src/components/TradingPage.js
import React, { useState, useEffect } from 'eact';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';
import useWeb3 from '../hooks/useWeb3';

const TradingPage = () => {
  const { user, token } = useAuth();
  const { data, error, isLoading, fetchData } = useApi('/trades', token);
  const { web3, account } = useWeb3();

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
    }
  }, [user]);

  const [tradeForm, setTradeForm] = useState({
    symbol: '',
    amount: '',
    price: '',
    type: 'buy', // or 'ell'
  });

  const handleTrade = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData('/trades', 'POST', tradeForm);
      console.log('Trade successful:', response);
    } catch (error) {
      console.error('Error trading:', error);
    }
  };

  const handleCancelTrade = async (tradeId) => {
    try {
      const response = await fetchData(`/trades/${tradeId}`, 'DELETE');
      console.log('Trade cancelled:', response);
    } catch (error) {
      console.error('Error cancelling trade:', error);
    }
  };

  const handleGetBalance = async () => {
    try {
      const balance = await web3.eth.getBalance(account);
      console.log('Balance:', balance);
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  return (
    <div>
      <h1>Trading Page</h1>
      <form onSubmit={handleTrade}>
        <label>
          Symbol:
          <input type="text" name="symbol" value={tradeForm.symbol} onChange={(event) => setTradeForm({...tradeForm, symbol: event.target.value })} />
        </label>
        <br />
        <label>
          Amount:
          <input type="number" name="amount" value={tradeForm.amount} onChange={(event) => setTradeForm({...tradeForm, amount: event.target.value })} />
        </label>
        <br />
        <label>
          Price:
          <input type="number" name="price" value={tradeForm.price} onChange={(event) => setTradeForm({...tradeForm, price: event.target.value })} />
        </label>
        <br />
        <label>
          Type:
          <select name="type" value={tradeForm.type} onChange={(event) => setTradeForm({...tradeForm, type: event.target.value })}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
        <br />
        <button type="submit">Trade</button>
      </form>
      <h2>Current Trades</h2>
      <ul>
        {data && data.map((trade) => (
          <li key={trade.id}>
            Symbol: {trade.symbol}
            Amount: {trade.amount}
            Price: {trade.price}
            Type: {trade.type}
            <button onClick={() => handleCancelTrade(trade.id)}>Cancel</button>
          </li>
        ))}
      </ul>
      <button onClick={handleGetBalance}>Get Balance</button>
    </div>
  );
};

export default TradingPage;