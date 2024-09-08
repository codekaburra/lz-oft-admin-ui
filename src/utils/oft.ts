import { BrowserProvider, ethers } from "ethers";
import OFT_ABI from "~/abi/OFT.json";
import { OFT_CONFIGS_OLD } from "~/const/ofts";
import {
  EIP6963ProviderDetailExtended,
  IChainIdToEndpointId,
  ILZMessageFee,
  ILZSendParam,
  IOFTConfig,
  IOFTEndpointStatus,
  IOFTEndpointStatusByChainId,
  IOFTStatus,
  IOFTStatusByChainId,
} from "~/vite-env";
import { getEndpointContract, isSupportedChainId } from ".";
import { BigNumberish } from "ethers";
import { CHAINS } from "~/const/chains";
import { JsonRpcProvider } from "ethers";

export async function getOFTContract(wallet: EIP6963ProviderDetailExtended) {
  if (wallet?.provider && wallet.chainId && isSupportedChainId(wallet.chainId)) {
    return intializeContract(
      OFT_CONFIGS_OLD[wallet.chainId].contractAddress,
      OFT_ABI,
      new BrowserProvider(wallet.provider),
    );
  }
}

export function getOFTReadOnlyContract(chainId: string, contractAddress: string) {
  const rpcUrl = CHAINS[chainId].rpc;
  const provider = new JsonRpcProvider(rpcUrl);
  if (provider && contractAddress) {
    return new ethers.Contract(contractAddress, OFT_ABI, provider);
  }
}

export async function intializeContract(
  contractAddress: string,
  abi: ethers.Interface | ethers.InterfaceAbi,
  provider: BrowserProvider,
) {
  return new ethers.Contract(contractAddress, abi, await provider.getSigner());
}

export async function getOFTQuoteSend(
  selectedWallet: EIP6963ProviderDetailExtended,
  sendParam: ILZSendParam,
): Promise<ILZMessageFee | undefined> {
  const contract = await getOFTContract(selectedWallet);
  if (contract) {
    const result = await contract.quoteSend(sendParam, false);
    console.log("quoteSend result", sendParam, result);
    return {
      nativeFee: result[0].toString(),
      lzTokenFee: result[1].toString(),
    } as ILZMessageFee;
  }
}

export async function getAllOFTStatus(oftConfig: IOFTConfig): Promise<IOFTStatusByChainId> {
  const allStatus: IOFTStatusByChainId = {};
  await Promise.all(
    Object.keys(oftConfig.addresses).map((chainid) =>
      getOFTStatus(chainid, oftConfig.addresses[chainid]).then((s) => {
        if (s) {
          allStatus[chainid] = s;
        }
      }),
    ),
  );
  return allStatus;
}

export async function getOFTStatus(chainId: string, contractAddress: string): Promise<IOFTStatus | undefined> {
  const contract = await getOFTReadOnlyContract(chainId, contractAddress);
  if (contract) {
    const result = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
      contract.owner(),
      contract.endpoint(),
      contract.token(),
      contract.approvalRequired(),
      contract.decimalConversionRate(),
      contract.msgInspector(),
      contract.oApp(),
      contract.oAppVersion(),
      contract.oftVersion(),
      contract.preCrime(),
      contract.sharedDecimals(),
    ]);

    if (result) {
      const [
        name,
        symbol,
        decimals,
        totalSupply,
        owner,
        endpoint,
        token,
        approvalRequired,
        decimalConversionRate,
        msgInspector,
        oApp,
        oAppVersion,
        oftVersion,
        preCrime,
        sharedDecimals,
      ] = result;
      const endpointContract = await getEndpointContract(chainId);
      const endpointDelegate = endpointContract ? endpointContract.delegates(contractAddress) : "";

      return {
        name,
        symbol,
        decimals,
        totalSupply,
        owner,
        endpoint,
        token,
        approvalRequired,
        decimalConversionRate: decimalConversionRate.toString(),
        msgInspector,
        oApp,
        oAppVersion: oAppVersion.map((x: BigNumberish) => x.toString()).join(","),
        oftVersion: oftVersion.map((x: BigNumberish) => x.toString()).join(","),
        preCrime,
        sharedDecimals: sharedDecimals.toString(),
        endpointDelegate,
      } as IOFTStatus;
    }
  }
}

export async function getAllOFTEndpointStatus(
  oftConfig: IOFTConfig,
  chainIdToEndpointId: IChainIdToEndpointId,
): Promise<IOFTEndpointStatusByChainId> {
  const allStatus: IOFTEndpointStatusByChainId = {};
  await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
  await Promise.all(
    Object.keys(oftConfig.addresses).map((chainid) =>
      getOFTEndpointStatus(chainid, oftConfig, chainIdToEndpointId).then((s) => {
        if (s) {
          allStatus[chainid] = s;
        }
      }),
    ),
  );
  return allStatus;
}

export async function getOFTEndpointStatus(
  chainId: string,
  oftConfig: IOFTConfig,
  chainIdToEndpointId: IChainIdToEndpointId,
): Promise<IOFTEndpointStatus | undefined> {
  const peerSettingByChainId: {
    [dstChainId: string]: {
      isPeer: boolean;
      enforcedOptions: string;
    };
  } = {};
  for (const dstChainId of Object.keys(oftConfig.addresses)) {
    const oft = getOFTReadOnlyContract(chainId, oftConfig.addresses[chainId]);
    if (oft) {
      peerSettingByChainId[dstChainId] = {
        isPeer: await oft.isPeer(
          chainIdToEndpointId[dstChainId],
          ethers.zeroPadValue(oftConfig.addresses[dstChainId], 32),
        ),
        enforcedOptions: (await oft.enforcedOptions(chainIdToEndpointId[dstChainId], 1)).toString(),
      };
    }
  }
  return {
    chainId,
    endpointId: chainIdToEndpointId[chainId],
    peerSetting: peerSettingByChainId,
  } as IOFTEndpointStatus;
}
