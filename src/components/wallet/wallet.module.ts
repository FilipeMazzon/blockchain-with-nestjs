import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  providers: [
    WalletService,
  ],
  exports: [
    WalletService,
  ],
})
export class WalletModule {
}
