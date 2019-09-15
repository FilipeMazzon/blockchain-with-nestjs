import { Body, Controller, Get, Post } from '@nestjs/common';
import { NetworkService } from './network.service';
import { Transaction } from '../Transaction';
import { TransactionCreateDto } from '../Transaction/dto';

@Controller('network')
export class NetworkController {
  constructor(
    private readonly networkService: NetworkService,
  ) {
  }

  @Get('/blocks')
  async getBlocks() {
    return this.networkService.getBlocks();
  }

  @Get('/transactions')
  async getTransactions(): Promise<Transaction[]> {
    return this.networkService.getTransactions();
  }

  @Post('/transact')
  async createTransaction(@Body() transaction: TransactionCreateDto): Promise<Transaction[]> {
    return this.networkService.createTransaction(transaction);
  }

  @Get('/mine-transactions')
  async mineTransactions() {
    return this.networkService.mineTransactions();
  }
}
