import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { TransactionModule } from '../Transaction/transaction.module';

@Module({
  imports: [
    BlockchainModule,
    TransactionModule,
  ],
  providers: [
    WalletService,
  ],
  exports: [
    WalletService,
  ],
})
export class WalletModule {
}
