import { Injectable, Logger } from '@nestjs/common';
import { ChainUtil } from '../../util/chain.util';
import { Transaction } from '../Transaction';
import { INITIAL_BALANCE } from '../../config';
import { Blockchain } from '../blockchain/blockchain.service';
import { TransactionPool } from '../Transaction/transactionPool';

@Injectable()
export class Wallet {
  private balance: number;
  private keyPair;
  private publicKey;
  private address: string;

  constructor(private readonly blockchain: Blockchain,
              private readonly transactionPool: TransactionPool) {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}`;
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  async createTransaction(recipient, amount) {
    this.balance = await this.calculateBalance();

    if (amount > this.balance) {
      Logger.log(`Amount: ${amount} exceceds current balance: ${this.balance}`);
      return;
    }

    let transaction = this.transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      await this.transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  async calculateBalance() {
    let balance = this.balance;
    const transactions = [];
    this.blockchain.getChain().forEach(block => block.getData().forEach(transaction => {
      transactions.push(transaction);
    }));

    const walletInputTs = transactions
      .filter(transaction => transaction.input.address === this.publicKey);

    let startTime = 0;

    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce(
        (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current,
      );

      balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
      startTime = recentInputT.input.timestamp;
    }

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.getOutputs().find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }

  getPublicKey() {
    return this.publicKey;
  }

  getAddress() {
    return this.address;
  }

  getWallet() {
    return this.balance;
  }
}
