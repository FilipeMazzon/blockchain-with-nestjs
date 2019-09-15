import { Body, Controller, Get, Post } from '@nestjs/common';
import { NetworkService } from './network.service';
import { TransactionService } from '../Transaction/transaction.service';
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
  async getTransactions(): Promise<TransactionService[]> {
    return this.networkService.getTransactions();
  }

  @Post('/transact')
  async createTransaction(@Body() transaction: TransactionCreateDto): Promise<TransactionService[]> {
    return this.networkService.createTransaction(transaction);
  }

  @Get('/mine-transactions')
  async mineTransactions() {
    return this.networkService.mineTransactions();
  }

  @Get('/public-key')
  async getPublicKey() {
    return this.networkService.getPublicKey();
  }
}
