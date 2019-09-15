import { Module } from '@nestjs/common';
import { NetworkModule } from './components/network/network.module';
import { TransactionModule } from './components/Transaction/transaction.module';

@Module({
  imports: [NetworkModule, TransactionModule],
})
export class AppModule {
}
