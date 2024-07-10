
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/Home/HomePage';
import PaymentPage from './pages/Payment/PaymentPage';
import AccountPage from './pages/Account/ProfilePage';
import SettingsPage from './pages/Account/SettingsPage';
import BorrowingPage from './pages/DeFi/BorrowingPage';
import LendingPage from './pages/DeFi/LendingPage';
import StakingPage from './pages/DeFi/StakingPage';
import TradingPage from './pages/DeFi/TradingPage';
import ProposalList from './pages/Governance/ProposalList';
import VotingPage from './pages/Governance/VotingPage';
import Dashboard from './containers/Dashboard';
import Portfolio from './containers/Portfolio';
import './App.css';

function App() {
  return (
    <Web3Provider>
      <ThemeProvider>
        <UserProvider>
          <Router>
            <Header />
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/payment" component={PaymentPage} />
              <Route path="/account" component={AccountPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/defi/borrowing" component={BorrowingPage} />
              <Route path="/defi/lending" component={LendingPage} />
              <Route path="/defi/staking" component={StakingPage} />
              <Route path="/defi/trading" component={TradingPage} />
              <Route path="/governance/proposals" component={ProposalList} />
              <Route path="/governance/voting" component={VotingPage} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/portfolio" component={Portfolio} />
            </Switch>
            <Footer />
          </Router>
        </UserProvider>
      </ThemeProvider>
    </Web3Provider>
  );
}

export default App;
