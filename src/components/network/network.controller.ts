import { Body, Controller, Get, Post } from '@nestjs/common';
import { NetworkService } from './network.service';
import { Transaction } from '../../interfaces/transaction.interface';

@Controller('network')
export class NetworkController {
  constructor(
    private readonly networkService: NetworkService) {
  }

  @Get('/blockchain')
  async getBlockchain() {
    return this.networkService.getBlockchain();
  }

  @Post('/transaction')
  async createTransaction(@Body('newTransaction') transaction: Transaction) {
    return this.networkService.createTransaction(transaction);
  }
}
