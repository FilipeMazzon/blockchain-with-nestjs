import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { TransactionPoolService } from '../Transaction/transactionPoolService';
import { WalletService } from '../wallet/wallet.service';
import { MinerService } from '../miner/Miner.service';
import { Block } from '../block';
import { Transaction } from '../Transaction';
import { TransactionCreateDto } from '../Transaction/dto';

@Injectable()
export class NetworkService {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly walletService: WalletService,
    private readonly tp: TransactionPoolService,
    private readonly miner: MinerService) {
  }

  async getBlocks(): Promise<Block[]> {
    return this.blockchainService.getChain();
  }

  async getTransaction(): Promise<Transaction[]> {
    return this.tp.getTransaction();
  }

  async getPublicKey() {
    return this.walletService.getPublicKey();
  }

  async createTransaction(transaction: TransactionCreateDto): Promise<Transaction[]> {
    const { recipient, amount } = transaction;
    try {
      const newTransaction = this.walletService.createTransaction(recipient, amount);
      // p2pServer.broadcastTransaction(newTransaction);
      return this.getTransaction();
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
