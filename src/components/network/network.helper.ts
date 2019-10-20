import { BadRequestException, HttpService, Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Block } from '../../interfaces';
import { Transaction } from '../Transaction';
import { AxiosResponse } from 'axios';

@Injectable()
export class NetworkHelper {
  private nodes: string[] = [];
  private currentNodeUrl: string = process.env.CURRENT_NODE_URL;

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly httpService: HttpService,
  ) {
  }

  async getNodes() {
    return this.nodes;
  }

  getCurrentNodeUrl() {
    return this.currentNodeUrl;
  }

  async joinNetwork(ip: string, blockchain: Block[]) {
    if (this.nodes.includes(ip)) {
      return new BadRequestException('already have this node in this blockchain');
    }
    if (this.currentNodeUrl === ip) {
      return new BadRequestException('you can`t connect with yourself!');
    } else {
      // this need be before the connect with other node because will enter on loop
      this.nodes.push(ip);
      if (this.nodes.length === 1) {
        await this.consensus(blockchain);
      }
      await this.connectWithOtherNodes(ip, this.currentNodeUrl, this.blockchainService.getChain());
      if (this.nodes.length === 1) {
        return `ip:${ip} was inserted`;
      }
      await this.consensus(blockchain);

      for (const node of this.nodes) {
        await this.connectWithOtherNodes(node, ip, null);
      }
      return `ip:${ip} was inserted`;
    }
  }

  async consensus(blockchain: Block[]) {
    const blockchains = await this.getBlockchain();
    if (blockchain !== blockchain) {
      Logger.log(null);
    }
    Logger.log(blockchains);
  }

  async getBlockchain(): Promise<Array<AxiosResponse<Block[]>>> {
    const requests = this.nodes.map(node => {
      return this.httpService.get(node + '/network/blocks').toPromise();
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

  async connectWithOtherNodes(node: string, ip: string, blockchain): Promise<any> {
    Logger.log(`envio para: ${node} conectar com o :${ip}`);
    return this.httpService.post(node + '/network/join', { ip, blockchain }).toPromise().then(res => res.data);
  }
}
