import { Injectable } from '@nestjs/common';
import { Block } from '../../interfaces/block.interface';
import * as sha256 from 'sha256';

const currentNodeUrl = process.env.CURRENT_NODE_URL || 'http://localhost:3000';
const zerosString = '000000';
const numberOfZeros = zerosString.length;

@Injectable()
export class ConsensusService {
  async hashBlock(previousBlockHash: string, currentBlockData, nonce: number): Promise<string> {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    return sha256(dataAsString);
  }

  async proofOfWork(previousBlockHash, currentBlockData): Promise<number> {
    let nonce = 0;
    let hash = await this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, numberOfZeros) !== zerosString) {
      nonce++;
      hash = await this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }

  async chainIsValid(blockchain: Block[]): Promise<boolean> {
    let validChain = true;
    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = await this.hashBlock(prevBlock.hash, {
        transactions: currentBlock.transactions,
        index: currentBlock.index,
      }, currentBlock.nonce);
      if (blockHash.substring(0, numberOfZeros) !== zerosString) {
        validChain = false;
      }
      if (currentBlock.previousBlockHash !== prevBlock.hash) {
        // chain not valid
        validChain = false;
        break;
      }
    }

   /* const genesisBlock = ConsensusService[0];
    const correctNonce = genesisBlock.nonce === 100;
    const correctPreviousBlockHash = genesisBlock.previousBlockHash === '0';
    const correctHash = genesisBlock.hash === '0';
    const correctTransactions = genesisBlock.transactions.length === 0;

    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
      validChain = false;
    }*/

    return validChain;
  }
}
