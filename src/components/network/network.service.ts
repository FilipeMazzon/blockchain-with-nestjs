import { Injectable, Logger } from '@nestjs/common';
import { Blockchain } from '../blockchain/blockchain.service';
import { TransactionPool } from '../Transaction/transactionPool';
import { Wallet } from '../wallet';
import { Miner } from '../Miner';
import { Block } from '../block';
import { Transaction } from '../Transaction';

@Injectable()
export class NetworkService {
  constructor(
    private readonly blockchain: Blockchain,
    private readonly wallet: Wallet,
    private readonly tp: TransactionPool,
    private readonly miner: Miner) {
  }

  async getBlocks(): Promise<Block[]> {
    return this.blockchain.getChain();
  }

  async getTransaction(): Promise<Transaction[]> {
    return this.tp.getTransaction();
  }

  async getPublicKey() {
    return this.wallet.getPublicKey();
  }

  async mineTransactions(): Promise<Block[]> {
    const block = this.miner.mine();
    Logger.log(`New block added: ${block.toString()}`, `networkService.`);
    return this.getBlocks();
  }
}
