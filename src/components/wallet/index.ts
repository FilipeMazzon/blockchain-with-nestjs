import { ChainUtil } from '../../util/chain.util';
import { INITIAL_BALANCE } from '../../config';

export class Wallet {
  private balance: number;
  private keyPair;
  private publicKey;
  private address: string;

  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}`;
  }

  getBalance() {
    return this.balance;
  }

  setBalance(balance: number): void {
    this.balance = balance;
  }

  getKeyPair() {
    return this.keyPair;
  }

  setKeyPair(keyPair): void {
    this.keyPair = keyPair;
  }

  getPublicKey() {
    return this.publicKey;
  }

  setPublicKey(publicKey): void {
    this.publicKey = publicKey;
  }

  getAddress() {
    return this.address;
  }

  setAddress(address: string): void {
    this.address = address;
  }
}
