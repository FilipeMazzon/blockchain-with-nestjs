import { ChainUtil } from '../../util/chain.util';
import { MINING_REWARD } from '../../config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TransactionService {
  private readonly id;
  private readonly data: any;

  constructor() {
    this.id = ChainUtil.id();
    this.data = null;
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) {
      Logger.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    TransactionService.signTransaction(this, senderWallet);

    return this;
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    TransactionService.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static newTransaction(senderWallet, recipient, amount) {
    if (amount > senderWallet.balance) {
      Logger.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    return TransactionService.transactionWithOutputs(senderWallet, [
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient },
    ]);
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    return TransactionService.transactionWithOutputs(blockchainWallet, [{
      amount: MINING_REWARD, address: minerWallet.publicKey,
    }]);
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs),
    );
  }

  // Gets
  getId() {
    return this.id;
  }

  getInput() {
    return this.input;
  }

  getOutputs() {
    return this.outputs;
  }
}
