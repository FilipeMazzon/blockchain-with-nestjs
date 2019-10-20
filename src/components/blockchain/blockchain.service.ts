import { Injectable } from '@nestjs/common';
import { Block } from '../../interfaces';
import { BlockUtil } from '../../util/block.util';
import { DIFFICULTY } from '../../config';

@Injectable()
export class BlockchainService {
  private chain: Block[] = [BlockUtil.genesis()];

  async generateBlock(data): Promise<Block> {
    const block = await BlockUtil.mineBlock(this.chain[this.chain.length - 1], data);
    await this.addBlock(block);
    return block;
  }

  async addBlock(block: Block) {
    return this.chain.push(block);
  }

  async validBlock(block: Block): Promise<boolean> {
    const lastHash = this.getLastBlock().hash;
    const { data, nonce, timestamp } = block;
    const hash = await BlockUtil.hash(timestamp, lastHash, data, nonce);
    if (hash !== block.hash) {
      throw new Error('block not valid hash');
    }
    if (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY)) {
      throw new Error('block not valid dificulty');
    }
    // @todo verificar se todas as transacoes estao no bloco de transacoes.
    {
      return true;
    }
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  setLargestChain(blockchain: Block[]): Block[] {
    return this.chain = blockchain;
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
