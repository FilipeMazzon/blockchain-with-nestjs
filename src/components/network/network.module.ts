import { Module } from '@nestjs/common';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Module({
  controllers: [NetworkController],
  providers: [
    NetworkService,
    BlockchainService,
  ],
})
export class NetworkModule {
}
