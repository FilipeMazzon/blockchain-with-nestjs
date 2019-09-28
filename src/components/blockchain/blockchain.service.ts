import { Injectable } from '@nestjs/common';
import { Block } from '../../interfaces';
import { BlockUtil } from '../../util/block.util';
import { DIFFICULTY } from '../../config';

@Injectable()
export class BlockchainService {
  private chain: Block[] = [BlockUtil.genesis()];

  async addBlock(data): Promise<Block> {
    const block = await BlockUtil.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);
    return block;
  }

  async validBlock(block: Block): Promise<boolean> {
    const lastHash = this.getLastBlock().hash;
    const { data, nonce, timestamp } = block;
    const hash = await BlockUtil.hash(timestamp, lastHash, data, nonce);
    if (hash !== block.hash) {
      return false;
    }
    if (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY)) {
      return false;
    }
    // @todo verificar se todas as transacoes estao no bloco de transacoes.
    {
      return true;
    }
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  async isValidChain(chain): Promise<boolean> {
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

  getChain(): Block[] {
    return this.chain;
  }
}
