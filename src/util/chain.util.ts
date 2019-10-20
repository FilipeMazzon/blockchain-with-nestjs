import * as sha256 from 'sha256';
import * as uuid from 'uuid/v4';

export class ChainUtil {
  static id() {
    return uuid();
  }

  static hash(data) {
    return sha256(JSON.stringify(data)).toString();
  }
}
