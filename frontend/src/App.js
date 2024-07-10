// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import HomePage from './pages/Home/HomePage';
import PaymentPage from './pages/Payment/PaymentPage';
import './App.css';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/payment" component={PaymentPage} />
          </Switch>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
