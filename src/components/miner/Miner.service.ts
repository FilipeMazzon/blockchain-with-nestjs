import { WalletService } from '../wallet/wallet.service';
import { Transaction } from '../Transaction';
import { BlockchainService } from '../blockchain/blockchain.service';
import { TransactionPoolService } from '../Transaction/transactionPoolService';
import { Logger } from '@nestjs/common';

export class MinerService {
  private p2pServer;

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly walletService: WalletService,
    private readonly transactionPoolService: TransactionPoolService,
    // private p2pServer;
  ) {
  }

  async mine() {
    Logger.log('Try to mine', 'MinerService.mine', true);
    const validTransactions = await this.transactionPoolService.validTransactions();
    Logger.log(validTransactions, 'MinerService.mine', true);
    /*  validTransactions.push(
        Transaction.rewardTransaction(this.walletService.getWallet(), WalletService.blockchainWallet()),
      );*/
    const block = await this.blockchainService.addBlock(validTransactions);
    // this.p2pServer.syncChains();
    await this.transactionPoolService.clear();
    // this.p2pServer.broadcastClearTransactions();

    return block;
  }
}
