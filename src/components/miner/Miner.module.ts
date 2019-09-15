import { Module } from '@nestjs/common';
import { MinerService } from './Miner.service';
import { TransactionModule } from '../Transaction/transaction.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [
    TransactionModule,
    BlockchainModule,
  ],
  providers: [
    MinerService,
  ],
  exports: [
    MinerService,
  ],
})
export class MinerModule {
}
