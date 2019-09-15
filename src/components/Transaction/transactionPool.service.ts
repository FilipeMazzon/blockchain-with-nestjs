import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from './index';

@Injectable()
export class TransactionPoolService {
  private transactions: Transaction[] = [];

  async addTransaction(transaction) {
    return this.transactions.push(transaction);
  }

  async clear(): Promise<void> {
    this.transactions = [];
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }
}
