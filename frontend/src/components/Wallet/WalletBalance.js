// frontend/src/components/WalletBalance.js
import React from 'react';

function WalletBalance({ balance }) {
  return (
    <div className="wallet-balance">
      <h2>Wallet Balance</h2>
      <p>
        <span className="balance-amount">{balance.amount}</span>
        <span className="balance-currency">{balance.currency}</span>
      </p>
    </div>
  );
}

export default WalletBalance;