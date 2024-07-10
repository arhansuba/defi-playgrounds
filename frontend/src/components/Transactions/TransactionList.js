// frontend/src/components/TransactionList.js
import React from 'react';
import TransactionItem from './TransactionItem';

function TransactionList({ transactions }) {
  return (
    <div className="transaction-list">
      <h2>Transaction History</h2>
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

export default TransactionList;