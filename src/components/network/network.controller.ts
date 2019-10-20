import { Body, Controller, Get, Post, Delete, Inject, forwardRef } from '@nestjs/common';
import { NetworkService } from './network.service';
import { Transaction } from '../Transaction';
import { TransactionCreateDto } from '../Transaction/dto';
import { NetworkHelper } from './network.helper';
import { Block, Blockchain } from '../../interfaces';

@Controller('network')
export class NetworkController {
  constructor(
    @Inject(forwardRef(() => NetworkService))
    private readonly networkService: NetworkService,
    @Inject(forwardRef(() => NetworkHelper))
    private readonly networkHelper: NetworkHelper,
  ) {
  }

  @Get('/blockchain')
  async getBlockchain(): Promise<Blockchain> {
    return this.networkService.getBlockchain();
  }

  @Get('/transactions')
  async getTransactions(): Promise<Transaction[]> {
    return this.networkService.getTransactions();
  }

  @Post('/transact')
  async createTransaction(@Body() transaction: TransactionCreateDto): Promise<Transaction[]> {
    return this.networkService.createTransaction(transaction);
  }

  @Post('/add-transaction')
  async addTransaction(@Body() transaction: Transaction): Promise<Transaction[]> {
    return this.networkService.addTransaction(transaction);
  }

  @Delete('/transactions')
  async clearTransaction(): Promise<Transaction[]> {
    return this.networkService.clearTransaction();
  }

  @Post('/validate-new-block')
  async validateNewBlock(@Body('block') block: Block): Promise<boolean> {
    return this.networkService.validateNewBlock(block);
  }

  @Get('/mine-transactions')
  async mineTransactions() {
    return this.networkService.mineTransactions();
  }

  @Post('/join')
  async joinNetwork(@Body('ip') ip: string, @Body('blockchain') blockchain: Block[]) {
    return this.networkHelper.joinNetwork(ip, blockchain);
  }

  @Get('/list')
  async getNodes(): Promise<string[]> {
    return this.networkHelper.getNodes();
  }
}
