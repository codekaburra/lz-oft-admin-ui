import { BigNumber } from "bignumber.js";
import { CHAINS } from "~/const/chains";
import { EIP1193Provider, IERC20Balance } from "~/vite-env";
export * from "./endpoint";
export * from "./oft";

export function isSupportedChainId(chainId: string) {
  return CHAINS[chainId] !== null;
}

export const toBaseUnit = (amount: BigNumber | string | number, decimals: number = 18) => {
  return new BigNumber(amount).shift(decimals);
};

export const formatNumber = (num?: BigNumber | string | number) => {
  if (!num) return "---";
  return new BigNumber(num).toString(10);
};

export const formatBalance = (rawBalance?: BigNumber | string | number, decimals: BigNumber | string | number = 18) => {
  if (!rawBalance) return "---";
  return new BigNumber(rawBalance).shift(-decimals).toString(10);
};

export const formatERC20Balance = (balance: IERC20Balance) => {
  return formatBalance(balance.rawBalance, balance.decimals);
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (addr: string) => {
  const upperAfterLastTwo = addr.slice(0, 2) + addr.slice(2);
  return `${upperAfterLastTwo.substring(0, 5)}...${upperAfterLastTwo.substring(39)}`;
};

export async function fetchBalance(provider: EIP1193Provider, userAddress: string) {
  const balance = (await provider.request({
    method: "eth_getBalance",
    params: [userAddress, null],
  })) as string;
  return new BigNumber(balance ? balance : 0);
}
