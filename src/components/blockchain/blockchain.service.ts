import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid/v4';
import { Block } from '../../interfaces/block.interface';
import { Transaction } from '../../interfaces/transaction.interface';
import * as sha256 from 'sha256';

const currentNodeUrl = process.env.CURRENT_NODE_URL || 'http://localhost:3000';
const zerosString = '000000';
const numberOfZeros = zerosString.length;

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

  async hashBlock(previousBlockHash: string, currentBlockData, nonce: number): Promise<string> {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    return sha256(dataAsString);
  }

  async proofOfWork(previousBlockHash, currentBlockData): Promise<number> {
    let nonce = 0;
    let hash = await this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, numberOfZeros) !== zerosString) {
      nonce++;
      hash = await this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }

  async chainIsValid(blockchain): Promise<boolean> {
    let validChain = true;
    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = await this.hashBlock(prevBlock.hash, {
        transactions: currentBlock.transactions,
        index: currentBlock.index,
      }, currentBlock.nonce);
      if (blockHash.substring(0, numberOfZeros) !== zerosString) {
        validChain = false;
      }
      if (currentBlock.previousBlockHash !== prevBlock.hash) {
        // chain not valid
        validChain = false;
        break;
      }
    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock.nonce === 100;
    const correctPreviousBlockHash = genesisBlock.previousBlockHash === '0';
    const correctHash = genesisBlock.hash === '0';
    const correctTransactions = genesisBlock.transactions.length === 0;

    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
      validChain = false;
    }

    return validChain;
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
