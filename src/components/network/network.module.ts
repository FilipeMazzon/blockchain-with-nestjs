import { Module } from '@nestjs/common';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { MinerService } from '../miner/Miner.service';
import { TransactionPoolService } from '../Transaction/transactionPoolService';
import { WalletService } from '../wallet/wallet.service';

@Module({
  controllers: [NetworkController],
  providers: [
    NetworkService,
    BlockchainService,
    WalletService,
    MinerService,
    TransactionPoolService,
  ],
})
export class NetworkModule {
}
