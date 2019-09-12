import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Transaction } from '../../interfaces/transaction.interface';

@Injectable()
export class NetworkService {
  constructor(
    private readonly blockchainService: BlockchainService) {
  }

  async getBlockchain() {
    return this.blockchainService.getChain();
  }

  async createTransaction(transaction: Transaction) {
    const blockIndex = this.blockchainService.addTransactionToPendingTransactions(transaction);
    return { note: `Transaction will be added in block ${blockIndex}.` };
  }
}
