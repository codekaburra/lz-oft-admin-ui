import { ethers, JsonRpcProvider } from "ethers";
import { OFT_CONFIGS_OLD } from "~/const/ofts";
import { IEndpointStatus } from "~/vite-env";
import ENDPOINT_V2_ABI from "~/abi/EndpointV2.json";
import { LAYERZERO_CONFIGS } from "~/const/layerzero";
import { isSupportedChainId } from ".";
import { CHAIN_ID_TO_LZ_CHAIN_ID, CHAINS } from "~/const/chains";

export function getLZConfigByChainId(chainId: string) {
  if (!isSupportedChainId(chainId)) return;
  const lzConfig = LAYERZERO_CONFIGS[CHAIN_ID_TO_LZ_CHAIN_ID[chainId]];
  return lzConfig;
}

export async function getEndpointContract(chainId: string) {
  const rpcUrl = CHAINS[chainId].rpc;
  const provider = new JsonRpcProvider(rpcUrl);
  if (!provider || !chainId || !isSupportedChainId(chainId)) return;
  const lzEndpointAddress = getLZConfigByChainId(chainId)?.endpointV2;
  if (!lzEndpointAddress) return;
  return new ethers.Contract(lzEndpointAddress, ENDPOINT_V2_ABI, provider);
}

export async function getEndpointStatus(chainId: string): Promise<IEndpointStatus | undefined> {
  if (!chainId) return;
  await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
  const contract = await getEndpointContract(chainId);
  if (contract) {
    const usdxAddress = OFT_CONFIGS_OLD[chainId].contractAddress;
    const [eid, delegates, lzToken, nativeToken, getRegisteredLibraries, getSendContext, isSendingMessage, owner] =
      await Promise.all([
        contract.eid(),
        contract.delegates(usdxAddress),
        contract.lzToken(),
        contract.nativeToken(),
        contract.getRegisteredLibraries(),
        contract.getSendContext(),
        contract.isSendingMessage(),
        contract.owner(),
      ]);
    return {
      eid: eid.toString(),
      delegates,
      lzToken,
      nativeToken,
      getRegisteredLibraries,
      getSendContext,
      isSendingMessage,
      owner,
    };
  }
}

export async function getEndpointId(chainId: string): Promise<string | undefined> {
  if (!chainId) return;
  const contract = await getEndpointContract(chainId);
  if (contract) {
    return (await contract.eid()).toString();
  }
}
