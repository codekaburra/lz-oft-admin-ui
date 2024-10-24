/// <reference types="vite/client" />

import BigNumber from "bignumber.js";

// Describes metadata related to a provider based on EIP-6963.
interface EIP6963ProviderInfo {
  rdns: string;
  uuid: string;
  name: string;
  icon: string;
}

// Represents the structure of a provider based on EIP-1193.
interface EIP1193Provider {
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void,
  ) => void;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void,
  ) => void;
  request: (request: { method: string; params?: Array<unknown> }) => Promise<unknown>;
}

// Combines the provider's metadata with an actual provider object, creating a complete picture of a
// wallet provider at a glance.
interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

interface EIP6963ProviderDetailExtended extends EIP6963ProviderDetail {
  chainId?: string;
}

// Represents the structure of an event dispatched by a wallet to announce its presence based on EIP-6963.
type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo;
    provider: Readonly<EIP1193Provider>;
  };
};

// An error object with optional properties, commonly encountered when handling eth_requestAccounts errors.
interface WalletError {
  code?: string;
  message?: string;
}

interface IOFTStatusByChainId {
  [chainId: string]: IOFTStatus;
}

interface IOFTStatus {
  name: string;
  symbol: string;
  decimals: BigNumber | string | number;
  totalSupply: BigNumber | string | number;
  owner: string;
  version: BigNumber | string | number;
  endpoint: string;
  endpointDelegate: string;
  token: string;
  approvalRequired: string | boolean;
  composeMsgSender: string;
  decimalConversionRate: string;
  msgInspector: string;
  oApp: string;
  oAppVersion: string;
  oftVersion: string;
  preCrime: string;
  sharedDecimals: string;
}

interface IOFTEndpointStatusByChainId {
  [chainId: string]: IOFTEndpointStatus;
}

interface IOFTEndpointStatus {
  chainId: string;
  endpointId: string;
  peerSetting: {
    [chainId: string]: {
      isPeer: boolean;
      enforcedOptions: string;
    };
  };
}

interface IEndpointStatus {
  eid: string;
  delegates: string;
  lzToken: string;
  nativeToken: string;
  getRegisteredLibraries: string;
  getSendContext: string;
  isSendingMessage: string;
  lzToken: string;
  nativeToken: string;
  owner: string;
}

interface IERC20Balance {
  rawBalance: BigNumber | string | number;
  name: string;
  symbol: string;
  decimals: BigNumber | string | number;
}

interface IChainInfo {
  chainName: string;
  nativeCurrency: string;
  isTestnet: boolean;
  icon: string;
  explorer: string;
  rpc: string;
}

interface IChainIdToEndpointId {
  [chainId: string]: string;
}

interface IOFTConfigs {
  [index: number | string]: IOFTConfig;
}

interface IOFTConfig {
  name: string;
  symbol: string;
  decimals: number | string;
  addresses: {
    [chainId: string]: string;
  };
}

interface IOFTConfigOld {
  contractAddress: string;
  chainId: number;
}

interface ILZSendCallParam {
  sendParam: ILZSendParam;
  messageFee: ILZMessageFee;
  refundAddress: string;
  transactionHash?: string;
}

interface ILZMessageFee {
  nativeFee: string;
  lzTokenFee: string;
}

interface ILZSendParam {
  dstEid: string;
  to: string;
  amountLD: string;
  minAmountLD: string;
  extraOptions: string;
  composeMsg: string;
  oftCmd: string;
}

interface IRoleCheckResult {
  address: string;
  balance: BigNumber | string | number;
  isBlacklisted: boolean;
  isMinter: boolean;
  isBurner: boolean;
  isPauser: boolean;
  isUpgradeAdmin: boolean;
  isBlacklister: boolean;
  isLZAuthorizedOperator: boolean;
}
