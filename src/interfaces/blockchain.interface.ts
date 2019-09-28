import { Block } from './block.interface';
import { Transaction } from '../components/Transaction';

export interface Blockchain {
  blocks: Block[];
  transactions: Transaction[];
}
