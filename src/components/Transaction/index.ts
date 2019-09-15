import { ChainUtil } from '../../util/chain.util';

export class Transaction {
  private readonly id;
  private readonly identification;
  private readonly data: any;
  private readonly timestamp: Date;

  constructor(data = null, identification = null) {
    this.id = ChainUtil.id();
    this.data = data;
    this.identification = identification;
    this.timestamp = new Date();
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
