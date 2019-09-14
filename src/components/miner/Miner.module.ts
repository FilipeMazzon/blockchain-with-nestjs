import { Module } from '@nestjs/common';
import { MinerService } from './Miner.service';
import { TransactionPoolService } from '../Transaction/transactionPoolService';
import { WalletService } from '../wallet/wallet.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Module({
  providers: [MinerService],
  exports: [
    MinerService,
    TransactionPoolService,
    BlockchainService,
    WalletService,
  ],
})
export class MinerModule {
}
