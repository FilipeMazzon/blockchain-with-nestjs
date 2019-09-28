import { HttpModule, Module } from '@nestjs/common';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';
import { NetworkHelper } from './network.helper';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { MinerModule } from '../miner/Miner.module';
import { TransactionModule } from '../Transaction/transaction.module';

@Module({
  imports: [
    MinerModule,
    TransactionModule,
    BlockchainModule,
    HttpModule,
  ],
  controllers: [NetworkController],
  providers: [
    NetworkService,
    NetworkHelper,
  ],
  exports: [
    NetworkService,
    NetworkHelper,
  ],
})
export class NetworkModule {
}
