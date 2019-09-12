import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid/v4';
import { Block } from '../../interfaces/block.interface';
import { Transaction } from '../../interfaces/transaction.interface';

const currentNodeUrl = process.env.CURRENT_NODE_URL || 'http://localhost:3000';

@Injectable()
export class BlockchainService {
  private chain = [];

  private pendingTransactions = [];
  private currentNodeUrl = currentNodeUrl;
  private networkNodes = [];

  async addBlock(block) {
    this.chain.push(block);
  }

  async getChain(): Promise<Block[]> {
    return this.chain;
  }

  async createNewBlock(nonce: number, previousBlockHash: string, hash: string, pendingTransactionsMined: any[]): Promise<Block> {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: pendingTransactionsMined,
      nonce,
      hash,
      previousBlockHash,
    };

    this.removeMinedTransactions(pendingTransactionsMined);
    this.chain.push(newBlock);

    return newBlock;
  }

  async removeMinedTransactions(pendingTransactionsMined): Promise<string[]> {
    return this.pendingTransactions.splice(0, pendingTransactionsMined.length);
  }

  async getLastBlock(): Promise<Block> {
    return this.chain[this.chain.length - 1];
  }

  async createNewTransaction(amount, sender, recipient): Promise<Transaction> {
    return {
      amount,
      sender,
      recipient,
      transactionId: uuid().split('-').join(''),
    };
  }

  async addTransactionToPendingTransactions(transaction: Transaction) {
    this.pendingTransactions.push(transaction);
    // return this.getLastBlock() + 1;
  }

  async getBlock(blockHash) {
    let correctBlock = null;
    this.chain.forEach(block => {
      if (block.hash === blockHash) {
        correctBlock = block;
      }
    });
    return correctBlock;
  }

  async getTransaction(transactionId) {
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.transactionId === transactionId) {
          correctTransaction = transaction;
          correctBlock = block;
        }
      });
    });

    return {
      transaction: correctTransaction,
      block: correctBlock,
    };
  }

  async getAddressData(address) {
    const addressTransactions = [];
    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.sender === address || transaction.recipient === address) {
          addressTransactions.push(transaction);
        }
      });
    });
    let balance = 0;
    addressTransactions.forEach(transaction => {
      if (transaction.recipient === address) {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    });
    return {
      addressTransactions,
      addressBalance: balance,
    };
  }
}
