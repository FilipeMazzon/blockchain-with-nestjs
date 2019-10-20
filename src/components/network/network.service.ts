import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { TransactionPoolService } from '../Transaction/transactionPool.service';
import { MinerService } from '../miner/Miner.service';
import { Block, Blockchain } from '../../interfaces';
import { Transaction } from '../Transaction';
import { TransactionCreateDto } from '../Transaction/dto';
import { NetworkHelper } from './network.helper';

@Injectable()
export class NetworkService {
  constructor(
    private readonly blockchainService: BlockchainService,
    @Inject(forwardRef(() => TransactionPoolService))
    private readonly transactionPoolService: TransactionPoolService,
    private readonly miner: MinerService,
    private readonly networkHelper: NetworkHelper) {
  }

  async getBlockchain(): Promise<Blockchain> {
    const blocks = await this.blockchainService.getChain();
    const transactions = await this.transactionPoolService.getTransactions();
    return {
      blocks,
      transactions,
    };
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.transactionPoolService.getTransactions();
  }

  async createTransaction(transaction: TransactionCreateDto): Promise<Transaction[]> {
    try {
      const { identification, ...data } = transaction;
      const newTransaction: Transaction = new Transaction(data, identification);
      await this.transactionPoolService.addTransaction(newTransaction);
      await this.networkHelper.broadCastTransactions(newTransaction);
      return this.getTransactions();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async addTransaction(transaction: Transaction): Promise<Transaction[]> {
    // @todo create validation of transaction
    try {
      Logger.log(`${this.networkHelper.getCurrentNodeUrl()} adding transaction`);
      await this.transactionPoolService.addTransaction(transaction);
      return this.getTransactions();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async mineTransactions(): Promise<Blockchain> {
    const block = await this.miner.mine();
    await this.networkHelper.broadCastValidateBlock(block);
    await this.networkHelper.broadCastClearTransaction();
    Logger.log(`New block added: ${block.toString()}`, `networkService.`);
    return this.getBlockchain();
  }

  async validateNewBlock(block: Block): Promise<boolean> {
    try {
      Logger.log(`receive block:${JSON.stringify(block, null, 2)}`, 'networkService.validateNewBlock', true);
      await this.blockchainService.validBlock(block);
      Logger.log(`is valid block`, `networkService.validateNewBlock`, true);
      await this.blockchainService.addBlock(block);
      return true;
    } catch (e) {
      throw new BadRequestException('block isn`t valid');
    }
  }

  async clearTransaction(): Promise<Transaction[]> {
    await this.transactionPoolService.clear();
    return this.getTransactions();
  }
}
