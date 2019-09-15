import { Module } from '@nestjs/common';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { MinerModule } from '../miner/Miner.module';
import { TransactionModule } from '../Transaction/transaction.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    MinerModule,
    TransactionModule,
    BlockchainModule,
    WalletModule,
  ],
  controllers: [NetworkController],
  providers: [
    NetworkService,
  ],
  exports: [NetworkService],
})
export class NetworkModule {
}
