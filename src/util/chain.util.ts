import { ec } from 'elliptic';
import sha256 from 'sha256';
import uuidV1 from 'uuid/v1';

const EC = new ec('secp256k1');

export class ChainUtil {
  static genKeyPair() {
    return EC.genKeyPair();
  }

  static id() {
    return uuidV1();
  }

  static hash(data) {
    return sha256(JSON.stringify(data)).toString();
  }

  static verifySignature(publicKey, signature, dataHash) {
    return EC.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }
}