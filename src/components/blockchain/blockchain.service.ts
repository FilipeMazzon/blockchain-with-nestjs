import { Injectable, Logger } from '@nestjs/common';
import { Block } from '../../interfaces';
import { BlockUtil } from '../../util/block.util';

const currentNodeUrl = process.env.CURRENT_NODE_URL || 'http://localhost:3000';

@Injectable()
export class BlockchainService {
  chain: Block[] = [BlockUtil.genesis()];

  async addBlock(data) {
    const block = await BlockUtil.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);

    return block;
  }

  getChain() {
    return this.chain;
  }

  async isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(BlockUtil.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (block.lastHash !== lastBlock.hash ||
        block.hash !== BlockUtil.blockHash(block)) {
        return false;
      }
    }

    return true;
  }

  async replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      Logger.log('Received chain is not longer than the current chain.', `blockChainService.replaceChain.${currentNodeUrl}`, true);
      return;
    } else if (!this.isValidChain(newChain)) {
      Logger.log('The received chain is not valid.', `blockChainService.replaceChain.${currentNodeUrl}`, true);
      return;
    }

    Logger.log('Replacing blockchain with the new chain.', `blockChainService.replaceChain.${currentNodeUrl}`, true);
    this.chain = newChain;
  }
}
