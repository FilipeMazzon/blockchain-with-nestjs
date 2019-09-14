import { Body, Controller, Get, Post } from '@nestjs/common';
import { NetworkService } from './network.service';
import { Transaction } from '../Transaction';
import { TransactionCreateDto } from '../Transaction/dto';
import { Wallet } from '../wallet';

@Controller('network')
export class NetworkController {
  constructor(
    private readonly networkService: NetworkService,
    private readonly wallet: Wallet) {
  }

  @Get('/blocks')
  async getBlocks() {
    return this.networkService.getBlocks();
  }

  @Get('/transactions')
  async getTransactions(): Promise<Transaction[]> {
    return this.networkService.getTransaction();
  }

  @Post('/transaction')
  async createTransaction(@Body() transaction: TransactionCreateDto): Promise<Transaction[]> {
    const { recipient, amount } = transaction;
    const newTransaction = this.wallet.createTransaction(recipient, amount);
    // p2pServer.broadcastTransaction(newTransaction);
    return this.networkService.getTransaction();
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
