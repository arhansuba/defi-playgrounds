// frontend/src/pages/Home/HomePage.js
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Account from '../Account/ProfilePage';
import Settings from '../Account/SettingsPage';
import Borrowing from '../DeFi/BorrowingPage';
import Lending from '../DeFi/LendingPage';
import Staking from '../DeFi/StakingPage';
import Trading from '../DeFi/TradingPage';
import ProposalList from '../Governance/ProposalList';
import VotingPage from '../Governance/VotingPage';
import PaymentPage from '../Payment/PaymentPage';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <ul>
        <li>
          <Link to="/account" onClick={() => handlePageChange('account')}>
            Account
          </Link>
        </li>
        <li>
          <Link to="/settings" onClick={() => handlePageChange('settings')}>
            Settings
          </Link>
        </li>
        <li>
          <Link to="/defi/borrowing" onClick={() => handlePageChange('borrowing')}>
            Borrowing
          </Link>
        </li>
        <li>
          <Link to="/defi/lending" onClick={() => handlePageChange('lending')}>
            Lending
          </Link>
        </li>
        <li>
          <Link to="/defi/staking" onClick={() => handlePageChange('staking')}>
            Staking
          </Link>
        </li>
        <li>
          <Link to="/defi/trading" onClick={() => handlePageChange('trading')}>
            Trading
          </Link>
        </li>
        <li>
          <Link to="/governance/proposals" onClick={() => handlePageChange('proposals')}>
            Proposals
          </Link>
        </li>
        <li>
          <Link to="/governance/voting" onClick={() => handlePageChange('voting')}>
            Voting
          </Link>
        </li>
        <li>
          <Link to="/payment" onClick={() => handlePageChange('payment')}>
            Payment
          </Link>
        </li>
      </ul>
      {currentPage === 'account' && <Account />}
      {currentPage === 'settings' && <Settings />}
      {currentPage === 'borrowing' && <Borrowing />}
      {currentPage === 'lending' && <Lending />}
      {currentPage === 'staking' && <Staking />}
      {currentPage === 'trading' && <Trading />}
      {currentPage === 'proposals' && <ProposalList />}
      {currentPage === 'voting' && <VotingPage />}
      {currentPage === 'payment' && <PaymentPage />}
      <Outlet />
    </div>
  );
};

export default HomePage;