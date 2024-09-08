import json from "~/configs/lz-chain-deployments.json";

export interface IlayerzeroConfig {
  [lzChainId: string]: {
    executor: string;
    endpointV2: string;
    sendUln301?: string;
    sendUln302: string;
    receiveUln301?: string;
    receiveUln302: string;
    lzExecutor?: string;
  };
}
export const LAYERZERO_CONFIGS: IlayerzeroConfig = json;
