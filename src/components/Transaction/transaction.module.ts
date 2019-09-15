import { Module } from '@nestjs/common';
import { TransactionPoolService } from './transactionPool.service';

@Module({
  providers: [
    TransactionPoolService,
  ],
  exports: [
    TransactionPoolService,
  ],
})
export class TransactionModule {
}
