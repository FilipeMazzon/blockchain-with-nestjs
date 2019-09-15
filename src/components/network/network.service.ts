import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { TransactionPoolService } from '../Transaction/transactionPool.service';
import { WalletService } from '../wallet/wallet.service';
import { MinerService } from '../miner/Miner.service';
import { Block } from '../../interfaces';
import { TransactionService } from '../Transaction/transaction.service';
import { TransactionCreateDto } from '../Transaction/dto';

@Injectable()
export class NetworkService {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly walletService: WalletService,
    @Inject(forwardRef(() => TransactionPoolService))
    private readonly transactionPoolService: TransactionPoolService,
    private readonly miner: MinerService) {
  }

  async getBlocks(): Promise<Block[]> {
    return this.blockchainService.getChain();
  }

  async getTransactions(): Promise<TransactionService[]> {
    return this.transactionPoolService.getTransactions();
  }

  async getPublicKey() {
    return this.walletService.getPublicKey();
  }

  async createTransaction(transaction: TransactionCreateDto): Promise<TransactionService[]> {
    const { recipient, amount } = transaction;
    try {
      const newTransaction = this.walletService.createTransaction(recipient, amount);
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
