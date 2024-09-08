import { IChainInfo } from "~/vite-env";

export enum MainnetChainIds {
  Ethereum = "1",
  Flare = "14",
}

export enum TestnetChainIds {
  EthereumSepolia = "11155111",
  FlareCoston2 = "114",
  PolygonAmoy = "80002",
}

export const CHAIN_ID_TO_LZ_CHAIN_ID: {
  [chainId: string]: string;
} = {
  [MainnetChainIds.Ethereum]: "ethereum",
  [MainnetChainIds.Flare]: "flare",
  [TestnetChainIds.FlareCoston2]: "flare-testnet",
  [TestnetChainIds.EthereumSepolia]: "sepolia",
  [TestnetChainIds.PolygonAmoy]: "amoy-testnet",
};

export const MAINNET_CHAINS: {
  [chainId: string]: IChainInfo;
} = {
  [MainnetChainIds.Ethereum]: {
    chainName: "Ethereum",
    nativeCurrency: "ETH",
    isTestnet: false,
    icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
    explorer: "https://etherscan.io/",
    rpc: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  },
  [MainnetChainIds.Flare]: {
    chainName: "Flare",
    nativeCurrency: "FLR",
    isTestnet: false,
    icon: "https://icons.llamao.fi/icons/chains/rsz_flare.jpg",
    explorer: "https://mainnet.flarescan.com/",
    rpc: "https://flare-api.flare.network/ext/bc/C/rpc",
  },
};

export const TESTNET_CHAINS: {
  [chainId: string]: IChainInfo;
} = {
  [TestnetChainIds.FlareCoston2]: {
    chainName: "Flare Coston2",
    nativeCurrency: "C2FLR",
    isTestnet: true,
    icon: "https://icons.llamao.fi/icons/chains/rsz_flare.jpg",
    explorer: "https://coston2-explorer.flare.network/",
    rpc: "https://coston2-api.flare.network/ext/bc/C/rpc",
  },
  [TestnetChainIds.EthereumSepolia]: {
    chainName: "Sepolia",
    nativeCurrency: "ETH",
    isTestnet: true,
    icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
    explorer: "https://sepolia.etherscan.io/",
    rpc: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  },
  [TestnetChainIds.PolygonAmoy]: {
    chainName: "Polygon Amoy",
    nativeCurrency: "MATIC",
    isTestnet: true,
    icon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
    explorer: "https://amoy.polygonscan.com/",
    rpc: "https://rpc-amoy.polygon.technology/",
  },
};

export const CHAINS: {
  [chainId: string]: IChainInfo;
} = {
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
};
