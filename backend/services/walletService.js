// walletService.js
const mongoose = require('mongoose');
const Wallet = require('./models/wallet');
const Transaction = require('./models/transaction');
const AuthService = require('./authService');

class WalletService {
  async createWallet(userId, currency) {
    const wallet = new Wallet({
      userId,
      currency,
      balance: 0,
    });
    try {
      await wallet.save();
      return { message: 'Wallet created successfully' };
    } catch (err) {
      return { error: 'Failed to create wallet' };
    }
  }

  async getWallet(userId, currency) {
    const wallet = await Wallet.findOne({ userId, currency });
    if (!wallet) {
      return { error: 'Wallet not found' };
    }
    return wallet;
  }

  async deposit(userId, currency, amount) {
    const wallet = await this.getWallet(userId, currency);
    if (!wallet) {
      return { error: 'Wallet not found' };
    }
    wallet.balance += amount;
    try {
      await wallet.save();
      await this.createTransaction(userId, currency, amount, 'deposit');
      return { message: 'Deposit successful' };
    } catch (err) {
      return { error: 'Failed to deposit funds' };
    }
  }

  async withdraw(userId, currency, amount) {
    const wallet = await this.getWallet(userId, currency);
    if (!wallet) {
      return { error: 'Wallet not found' };
    }
    if (wallet.balance < amount) {
      return { error: 'Insufficient funds' };
    }
    wallet.balance -= amount;
    try {
      await wallet.save();
      await this.createTransaction(userId, currency, amount, 'withdrawal');
      return { message: 'Withdrawal successful' };
    } catch (err) {
      return { error: 'Failed to withdraw funds' };
    }
  }

  async transfer(userId, recipientId, currency, amount) {
    const senderWallet = await this.getWallet(userId, currency);
    const recipientWallet = await this.getWallet(recipientId, currency);
    if (!senderWallet || !recipientWallet) {
      return { error: 'Wallet not found' };
    }
    if (senderWallet.balance < amount) {
      return { error: 'Insufficient funds' };
    }
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;
    try {
      await senderWallet.save();
      await recipientWallet.save();
      await this.createTransaction(userId, currency, amount, 'transfer');
      await this.createTransaction(recipientId, currency, amount, 'receive');
      return { message: 'Transfer successful' };
    } catch (err) {
      return { error: 'Failed to transfer funds' };
    }
  }

  async createTransaction(userId, currency, amount, type) {
    const transaction = new Transaction({
      userId,
      currency,
      amount,
      type,
    });
    try {
      await transaction.save();
    } catch (err) {
      console.error(err);
    }
  }

  async getTransactions(userId, currency) {
    const transactions = await Transaction.find({ userId, currency });
    return transactions;
  }
}

module.exports = new WalletService();