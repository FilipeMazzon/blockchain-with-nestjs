import { Module } from '@nestjs/common';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';
import { Blockchain } from '../blockchain/blockchain.service';

@Module({
  controllers: [NetworkController],
  providers: [
    NetworkService,
    Blockchain,
  ],
})
export class NetworkModule {
}
