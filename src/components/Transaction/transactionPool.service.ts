import { TransactionService } from './transaction.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TransactionPoolService {
  private transactions: TransactionService[] = [];

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

  async validTransactions() {
    return this.transactions.filter(transaction => {
      Logger.log(transaction.getOutputs());
      Logger.log(transaction.getInput());
      const outputTotal = transaction.getOutputs().reduce((total, output) => {
        return total + output.amount;
      }, 0);
      Logger.log(`outputTotal:${outputTotal}`);
      if (transaction.getInput().amount !== outputTotal) {
        Logger.error(`Invalid transaction from ${transaction.getInput().address}.`);
        return;
      }

      if (!TransactionService.verifyTransaction(transaction)) {
        Logger.log(`Invalid signature from ${transaction.getInput().address}.`);
        return;
      }

      return transaction;
    });
  }

  async clear(): Promise<void> {
    this.transactions = [];
  }

  getTransactions() {
    Logger.log(this.transactions, 'transactionPoolService.getTransactions', true);
    return this.transactions;
  }
}

export const transactionPoolService = new TransactionPoolService();
