import { ChainUtil } from '../../util/chain.util';

export class Transaction {
  private readonly id;
  private readonly identification;
  private readonly data: any;
  private readonly timestamp: number;

  constructor(data = null, identification = null, timestamp = Date.now(), id = ChainUtil.id()) {
    this.id = id;
    this.data = data;
    this.identification = identification;
    this.timestamp = timestamp;
  }

  static newTransaction(data, identification) {
    return new this(data, identification);
  }

  // Gets
  public getId() {
    return this.id;
  }

  public getData() {
    return this.data;
  }

  public getIdentification() {
    return this.identification;
  }
}
