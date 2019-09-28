export interface Block {
  _id?: string;
  timestamp: string;
  lastHash: string;
  hash: string;
  data: any;
  nonce: number;
}
