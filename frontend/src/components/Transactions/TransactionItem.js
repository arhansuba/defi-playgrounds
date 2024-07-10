// frontend/src/components/TransactionItem.js
import React from 'react';

function TransactionItem({ transaction }) {
  return (
    <div className="transaction-item">
      <div className="transaction-info">
        <h3>{transaction.type}</h3>
        <p>{transaction.date}</p>
      </div>
      <div className="transaction-amount">
        <p>{transaction.amount} {transaction.currency}</p>
      </div>
      <div className="transaction-status">
        {transaction.status === 'pending' ? (
          <span className="pending">Pending</span>
        ) : (
          <span className="confirmed">Confirmed</span>
        )}
      </div>
    </div>
  );
}

export default TransactionItem;