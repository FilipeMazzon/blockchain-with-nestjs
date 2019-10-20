import { BlockchainService } from '../blockchain/blockchain.service';
import { TransactionPoolService } from '../Transaction/transactionPool.service';
import { Transaction } from '../Transaction';
import { forwardRef, Inject, Logger, NotFoundException } from '@nestjs/common';

export class MinerService {
  constructor(
    private readonly blockchainService: BlockchainService,
    @Inject(forwardRef(() => TransactionPoolService))
    private readonly transactionPoolService: TransactionPoolService,
  ) {
  }

  async mine() {
    Logger.log('getting transactions', 'MinerService.mine', true);
    const validTransactions: Transaction[] = this.transactionPoolService.getTransactions();
    if (!validTransactions.length) {
      throw new NotFoundException('do not have any transaction to mine!');
    } else {
      Logger.log('try to mine transactions', 'MinerService.mine', true);
      const block = await this.blockchainService.generateBlock(validTransactions);
      await this.transactionPoolService.clear();
      return block;
    }

  }
}
