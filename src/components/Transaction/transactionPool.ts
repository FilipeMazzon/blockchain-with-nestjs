import { Transaction } from './index';
import { Logger } from '@nestjs/common';

export class TransactionPool {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  async updateOrAddTransaction(transaction) {
    const transactionWithId = this.transactions.find(t => t.getId() === transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransaction(address) {
    return this.transactions.find(t => t.getInput().address === address);
  }

  validTransactions() {
    return this.transactions.filter(transaction => {
      const outputTotal = transaction.getOutputs().reduce((total, output) => {
        return total + output.amount;
      }, 0);

      if (transaction.getInput().amount !== outputTotal) {
        Logger.log(`Invalid transaction from ${transaction.getInput().address}.`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        Logger.log(`Invalid signature from ${transaction.getInput().address}.`);
        return;
      }

      return transaction;
    });
  }

  async clear(): Promise<void> {
    this.transactions = [];
  }

  getTransaction() {
    return this.transactions;
  }
}
