export interface BlockHeaderModel {
  nonce: number;
  blockHash: string;
}

export interface PayloadModel {
  sequency: number;
  timestamp: number;
  data: any;
  prevHash: string;
}

export interface BlockModel {
  header: BlockHeaderModel;
  payload: PayloadModel;
}
