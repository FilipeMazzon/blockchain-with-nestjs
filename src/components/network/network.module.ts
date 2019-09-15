import { Module } from '@nestjs/common';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { MinerModule } from '../miner/Miner.module';
import { TransactionModule } from '../Transaction/transaction.module';

@Module({
  imports: [
    MinerModule,
    TransactionModule,
    BlockchainModule,
  ],
  controllers: [NetworkController],
  providers: [
    NetworkService,
  ],
  exports: [NetworkService],
})
export class NetworkModule {
}
