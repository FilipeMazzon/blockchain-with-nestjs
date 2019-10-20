import { Injectable } from '@nestjs/common';
import { Transaction } from './index';

@Injectable()
export class TransactionPoolService {
  private transactions: Transaction[] = [];

  async addTransaction(transaction: Transaction) {
    return this.transactions.push(transaction);
  }

  async clear(): Promise<void> {
    this.transactions = [];
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  setTransactions(transactions: Transaction[]): Transaction[] {
    return this.transactions = transactions;
  }
}
