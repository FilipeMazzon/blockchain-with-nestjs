import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { TransactionPoolService } from '../Transaction/transactionPool.service';
import { MinerService } from '../miner/Miner.service';
import { Block } from '../../interfaces';
import { Transaction } from '../Transaction';
import { TransactionCreateDto } from '../Transaction/dto';
import { ChainUtil } from '../../util/chain.util';

@Injectable()
export class NetworkService {
  constructor(
    private readonly blockchainService: BlockchainService,
    @Inject(forwardRef(() => TransactionPoolService))
    private readonly transactionPoolService: TransactionPoolService,
    private readonly miner: MinerService) {
  }

  async getBlocks(): Promise<Block[]> {
    return this.blockchainService.getChain();
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.transactionPoolService.getTransactions();
  }

  async createTransaction(transaction: TransactionCreateDto): Promise<Transaction[]> {
    try {
      const { identification, ...data } = transaction;
      const newTransaction: Transaction = new Transaction(data, identification);
      await this.transactionPoolService.addTransaction(newTransaction);
      // p2pServer.broadcastTransaction(newTransaction);
      return this.getTransactions();
    } catch (e) {
      throw new BadRequestException(e);
    }

  }

  async mineTransactions(): Promise<Block[]> {
    const block = await this.miner.mine();
    Logger.log(`New block added: ${block.toString()}`, `networkService.`);
    return this.getBlocks();
  }
}
