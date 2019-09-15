import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionPoolService } from './transactionPool.service';

@Module({
  providers: [
    TransactionService,
    TransactionPoolService,
  ],
  exports: [
    TransactionService,
    TransactionPoolService,
  ],
})
export class TransactionModule {
}
