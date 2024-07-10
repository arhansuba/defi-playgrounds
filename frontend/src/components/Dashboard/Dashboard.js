// frontend/src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Header from '../Header/Header';
import WalletBalance from '../Wallet/WalletBalance';
import WalletHistory from '../Wallet/WalletHistory';
import TransactionList from '../Transactions/TransactionList';
import LineChart from '../Charts/LineChart';
import PieChart from '../Charts/PieChart';
import Button from '../Button';

function Dashboard() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Fetch wallet balance and transaction history from API
    fetch('/api/wallet/balance')
      .then(response => response.json())
      .then(data => setWalletBalance(data.balance));

    fetch('/api/transactions/history')
      .then(response => response.json())
      .then(data => setTransactionHistory(data.transactions));

    // Fetch chart data from API
    fetch('/api/charts/data')
      .then(response => response.json())
      .then(data => setChartData(data));
  }, []);

  const handleDeposit = () => {
    // Handle deposit button click
    console.log('Deposit button clicked!');
  };

  const handleWithdraw = () => {
    // Handle withdraw button click
    console.log('Withdraw button clicked!');
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="wallet-section">
        <WalletBalance balance={walletBalance} />
        <WalletHistory history={transactionHistory} />
        <Button onClick={handleDeposit}>Deposit</Button>
        <Button onClick={handleWithdraw}>Withdraw</Button>
      </div>
      <div className="charts-section">
        <LineChart data={chartData.line} title="Daily Transactions" />
        <PieChart data={chartData.pie} title="Transaction Types" />
      </div>
      <div className="transactions-section">
        <TransactionList transactions={transactionHistory} />
      </div>
    </div>
  );
}

export default Dashboard;