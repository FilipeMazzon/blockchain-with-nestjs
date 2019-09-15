import { DIFFICULTY, MINE_RATE } from '../config';
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
      difficulty: DIFFICULTY,
    };
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty =
      lastBlock.timestamp + MINE_RATE > currentTime
        ? difficulty + 1
        : difficulty - 1;
    return difficulty;
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return this.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static async mineBlock(lastBlock, data): Promise<Block> {
    let hash;
    let timestamp;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.adjustDifficulty(lastBlock, timestamp);
      hash = this.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return {
      timestamp,
      lastHash,
      hash,
      data,
      nonce,
      difficulty,
    };
  }
}
