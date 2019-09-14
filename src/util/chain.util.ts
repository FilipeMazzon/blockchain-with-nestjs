import { ec } from 'elliptic';
import * as sha256 from 'sha256';
import * as uuid from 'uuid/v4';

const EC = new ec('secp256k1');

export class ChainUtil {
  static genKeyPair() {
    return EC.genKeyPair();
  }

  static id() {
    return uuid();
  }

  static hash(data) {
    return sha256(JSON.stringify(data)).toString();
  }

  static verifySignature(publicKey, signature, dataHash) {
    return EC.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }
}
