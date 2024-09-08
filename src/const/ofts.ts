import { IOFTConfig, IOFTConfigOld } from "~/vite-env";
import json from "~/configs/ofts.json";

export const OFT_CONFIGS: {
  [oftId: string]: IOFTConfig;
} = json;

export const USDX_DECIMALS = 6;

export const OFT_CONFIGS_OLD: {
  [oftId: string]: IOFTConfigOld;
} = {
  "114": {
    contractAddress: "0x6ccB96ae6D52e88ed2269288F5e47bD2914C2785",
    chainId: 114,
  },
  "11155111": {
    contractAddress: "0x4C98e6e4167DF322B9bbb48a508f7dF3c69E85e5",
    chainId: 11155111,
  },
  "80002": {
    contractAddress: "0x72219A742A8fa878aB893b64AA1873a2F3B8D67C",
    chainId: 80002,
  },
  "1": {
    contractAddress: "0x7A486F809c952a6f8dEc8cb0Ff68173F2B8ED56c",
    chainId: 1,
  },
  "14": {
    contractAddress: "0x4A771Cc1a39FDd8AA08B8EA51F7Fd412e73B3d2B",
    chainId: 14,
  },
};
