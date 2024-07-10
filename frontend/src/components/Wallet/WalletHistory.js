// frontend/src/components/WalletHistory.js
import React, { useState, useEffect } from 'eact';
import TransactionItem from './TransactionItem';

function WalletHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWalletHistory()
     .then(response => response.json())
     .then(data => {
        setTransactions(data.transactions);
        setLoading(false);
      })
     .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="wallet-history">
      <h2>Wallet History</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            <TransactionItem transaction={transaction} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const fetchWalletHistory = () => {
  // Replace with your API endpoint or data fetching logic
  return fetch('/api/wallet/history');
};

export default WalletHistory;