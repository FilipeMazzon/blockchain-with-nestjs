import { BadRequestException, HttpService, Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Block, Blockchain } from '../../interfaces';
import { Transaction } from '../Transaction';
import { TransactionPoolService } from '../Transaction/transactionPool.service';

@Injectable()
export class NetworkHelper {
  private nodes: string[] = [];
  private currentNodeUrl: string = process.env.CURRENT_NODE_URL;

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly transactionPoolService: TransactionPoolService,
    private readonly httpService: HttpService,
  ) {
  }

  async getNodes() {
    return this.nodes;
  }

  getCurrentNodeUrl() {
    return this.currentNodeUrl;
  }

  async joinNetwork(ip: string) {
    if (this.nodes.includes(ip)) {
      return new BadRequestException('already have this node in this blockchain');
    }
    if (this.currentNodeUrl === ip) {
      return new BadRequestException('you can`t connect with yourself!');
    } else {
      // this need be before the connect with other node because will enter on loop
      this.nodes.push(ip);
      if (this.nodes.length === 1) {
        await this.consensus();
      }
      await this.connectWithOtherNodes(ip, this.currentNodeUrl);
      if (this.nodes.length === 1) {
        return `ip:${ip} was inserted`;
      }
      await this.consensus();

      for (const node of this.nodes) {
        await this.connectWithOtherNodes(node, ip);
      }
      return `ip:${ip} was inserted`;
    }
  }

  async consensus() {
    const blockchains = await this.getBlockchains();
    const myBlockchain = this.blockchainService.getChain();
    for (const blockchain of blockchains) {
      if (blockchain.blocks.length > myBlockchain.length) {
        if (await this.blockchainService.isValidChain(blockchain.blocks)) {
          this.blockchainService.setLargestChain(blockchain.blocks);
          this.transactionPoolService.setTransactions(blockchain.transactions);
        }
      }
    }
  }

  async getBlockchains(): Promise<Blockchain[]> {
    const requests = this.nodes.map(node => {
      return this.httpService.get(node + '/network/blockchain').toPromise();
    });
    return Promise.all(requests).then(result => {
      return result.map(blockchain => {
        return blockchain.data;
      });
    });
  }

  async broadCastTransactions(transaction: Transaction) {
    const requests = this.nodes.map((node) => {
      return this.httpService.post(node + '/network/add-transaction', { ...transaction }).toPromise();
    });
    Promise.all(requests).then(() => {
      Logger.log('', 'networkService.broadcastTransaction', true);
    }).catch(err => {
      Logger.error(err.message, err, 'networkHelper.broadCastValidateBlock', true);
    });
  }

  async broadCastClearTransaction() {
    const requests = this.nodes.map((node) => {
      return this.httpService.delete(`${node}/network/transactions`).toPromise();
    });
    Promise.all(requests).then(() => {
      Logger.log('', 'networkService.broadcastTransaction', true);
    }).catch(err => {
      Logger.error(err.message, err, 'networkHelper.broadCastValidateBlock', true);
    });
  }

  async broadCastValidateBlock(block: Block) {
    const requests = this.nodes.map((node) => {
      return this.httpService.post(`${node}/network/validate-new-block`, { block }).toPromise();
    });
    Promise.all(requests).then(() => {
      Logger.log('', 'networkService.broadCastValidateBlock', true);
    }).catch(err => {
      Logger.error(err.message, err, 'networkHelper.broadCastValidateBlock', true);
    });
  }

  async connectWithOtherNodes(node: string, ip: string): Promise<any> {
    Logger.log(`envio para: ${node} conectar com o :${ip}`);
    return this.httpService.post(node + '/network/join', { ip }).toPromise().then(res => res.data);
  }
}
