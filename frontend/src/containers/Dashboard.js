// frontend/src/containers/Dashboard.js
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchWalletBalance, fetchTransactionHistory, fetchChartData } from '../actions';
import DashboardComponent from '../components/Dashboard';
import Header from '../components/Header';
import WalletBalance from '../components/Wallet/WalletBalance';
import WalletHistory from '../components/Wallet/WalletHistory';
import TransactionList from '../components/Transactions/TransactionList';
import LineChart from '../components/Charts/LineChart';
import PieChart from '../components/Charts/PieChart';
import Button from '../components/Button';

const Dashboard = ({ fetchWalletBalance, fetchTransactionHistory, fetchChartData, walletBalance, transactionHistory, chartData }) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  useEffect(() => {
    fetchWalletBalance();
    fetchTransactionHistory();
    fetchChartData();
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
    <DashboardComponent>
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
    </DashboardComponent>
  );
};

const mapStateToProps = state => {
  return {
    walletBalance: state.wallet.balance,
    transactionHistory: state.transactions.history,
    chartData: state.charts.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWalletBalance: () => dispatch(fetchWalletBalance()),
    fetchTransactionHistory: () => dispatch(fetchTransactionHistory()),
    fetchChartData: () => dispatch(fetchChartData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);