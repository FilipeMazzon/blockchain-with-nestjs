import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionService } from '../Transaction/transaction.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { TransactionPoolService } from '../Transaction/transactionPool.service';
import { Wallet } from './index';

@Injectable()
export class WalletService {
  private wallet: Wallet = new Wallet();

  constructor(
    private readonly blockchainService: BlockchainService,
    @Inject(forwardRef(() => TransactionPoolService))
    private readonly transactionPool: TransactionPoolService,
  ) {

  }

  sign(dataHash) {
    return this.wallet.getKeyPair().sign(dataHash);
  }

  async createTransaction(recipient, amount) {
    this.wallet.setBalance(await this.calculateBalance());

    if (amount > this.wallet.getBalance()) {
      Logger.log(`Amount: ${amount} exceceds current balance: ${this.wallet.getBalance()}`);
      return;
    }

    let transaction = this.transactionPool.existingTransaction(this.wallet.getPublicKey());

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = TransactionService.newTransaction(this, recipient, amount);
      await this.transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  async calculateBalance() {
    let balance = this.wallet.getBalance();
    const transactions = [];
    this.blockchainService.getChain().forEach(block => block.data.forEach(transaction => {
      transactions.push(transaction);
    }));

    const walletInputTs = transactions
      .filter(transaction => transaction.input.address === this.wallet.getPublicKey());

    let startTime = 0;

    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce(
        (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current,
      );

      balance = recentInputT.outputs.find(output => output.address === this.wallet.getPublicKey()).amount;
      startTime = recentInputT.input.timestamp;
    }

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.getOutputs().find(output => {
          if (output.address === this.wallet.getPublicKey()) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  static blockchainWallet() {
    // const blockchainWallet = new this(null, null);
    // blockchainWallet.address = 'blockchain-wallet';
    return this;
  }

  getPublicKey() {
    return this.wallet.getPublicKey();
  }

  getWallet() {
    return this.wallet;
  }

  getAddress() {
    return this.wallet.getAddress();
  }
}
