import { DIFFICULTY } from '../config';
import { Block } from '../interfaces';
import { ChainUtil } from './chain.util';

export class BlockUtil {
  static genesis(): Block {
    return {
      _id: 'firstblock',
      timestamp: 'Genesis time',
      lastHash: '-----',
      hash: 'f1r57-h45h',
      data: [],
      nonce: 0,
    };
  }

  static hash(timestamp, lastHash, data, nonce) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}`).toString();
  }

  static blockHash(block: Block) {
    const { timestamp, lastHash, data, nonce } = block;
    return this.hash(timestamp, lastHash, data, nonce);
  }

  static async mineBlock(lastBlock: Block, data): Promise<Block> {
    let hash;
    let timestamp;
    let nonce = 0;
    const { hash: lastHash } = lastBlock;
    do {
      nonce++;
      timestamp = Date.now();
      hash = this.hash(timestamp, lastHash, data, nonce);
    } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

    return {
      timestamp,
      lastHash,
      hash,
      data,
      nonce,
    };
  }
}
