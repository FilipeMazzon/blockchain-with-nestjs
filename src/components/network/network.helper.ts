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

  async joinNetwork(ip: string) {
    if (this.nodes.includes(ip)) {
      return new BadRequestException('already have this node in this blockchain');
    }
    if (this.currentNodeUrl === ip) {
      return new BadRequestException('you can`t connect with yourself!');
    } else {
      // this need be before the connect with other node because will enter on loop
      this.nodes.push(ip);
      await this.connectWithOtherNodes(ip, this.currentNodeUrl);
      if (this.nodes.length === 1) {
        return;
      }
      this.consensus();
      for (const node of this.nodes) {
        await this.connectWithOtherNodes(node, ip);
      }
      return `ip:${ip} was inserted`;
    }
  }

  async consensus() {
    const blockchains = await this.getBlockchain();
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
      return this.httpService.post(node + '/network/add-transaction', { transaction }).toPromise();
    });
    Promise.all(requests).then((result) => {
      Logger.log(result);
    }).catch();
  }

  async broadCastClearTransaction() {
    for (const node of this.nodes) {
      this.httpService.delete(`${node}/network/transactions`);
    }
  }

  async broadCastValidateBlock(block: Block) {
    const requests = [];
    for (const node of this.nodes) {
      requests.push(this.httpService.post(`${node}/network/validate-new-block`, { block }));
    }
    Promise.all(requests).then();
  }

  async connectWithOtherNodes(node: string, ip: string): Promise<any> {
    Logger.log(`envio para: ${node} conectar com o :${ip}`);
    return this.httpService.post(node + '/network/join', { ip }).toPromise().then(res => res.data);
  }
}
