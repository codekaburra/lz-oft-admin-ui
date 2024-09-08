import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { CHAINS } from "~/const/chains";
import { OFT_CONFIGS } from "~/const/ofts";
import { getEndpointId } from "~/utils";
import { IChainIdToEndpointId, IOFTConfig } from "~/vite-env";

export interface TokenSelectorContext {
  selectedToken?: IOFTConfig;
  chainIdToEndpointId: IChainIdToEndpointId;
}

export const TokenSelectorContext = createContext<TokenSelectorContext>({
  chainIdToEndpointId: {},
});

export const TokenSelector: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string | undefined>(undefined);
  const [selectedToken, setSelectedToken] = useState<IOFTConfig | undefined>(undefined);
  const [chainIdToEndpointId, setChainIdToEndpointId] = useState<IChainIdToEndpointId>({});

  const handleSelectedTokenId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTokenId(event.target.value);
  };

  useEffect(() => {
    if (!selectedTokenId) return;
    const oftConfig: IOFTConfig = OFT_CONFIGS[selectedTokenId];
    Object.keys(oftConfig.addresses).map((chainId) => {
      getEndpointId(chainId).then((eid) => {
        if (eid) {
          setChainIdToEndpointId((current) => ({
            ...current,
            [chainId]: eid.toString(),
          }));
        }
      });
    });
    setSelectedToken(oftConfig);
  }, [selectedTokenId]);

  const contextValue: TokenSelectorContext = {
    selectedToken,
    chainIdToEndpointId,
  };

  return (
    <TokenSelectorContext.Provider value={contextValue}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-xl bg-white p-4 shadow sm:p-7 dark:bg-neutral-900">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-neutral-200">Token</h2>
            <p className="text-sm text-gray-600 dark:text-neutral-400">Select OFT</p>
          </div>

          <form>
            <div className="border-t border-gray-200 py-6 first:border-transparent first:pt-0 last:pb-0 dark:border-neutral-700 dark:first:border-transparent">
              <div className="mt-2 space-y-3">
                <select
                  className="focus:border-dark-500 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:ring-blue-500 dark:border-zinc-600 dark:bg-neutral-800 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  value={selectedTokenId}
                  onChange={handleSelectedTokenId}
                >
                  <option></option>
                  {Object.keys(OFT_CONFIGS).map((tokenId, index) => (
                    <option value={tokenId} key={`TokenSelector${index}`}>
                      {OFT_CONFIGS[tokenId].name} ({OFT_CONFIGS[tokenId].symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
          {selectedToken &&
            Object.keys(selectedToken.addresses).map((chainId) => (
              <span className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {CHAINS[chainId].chainName}
              </span>
            ))}
        </div>
      </div>
      {children}
    </TokenSelectorContext.Provider>
  );
};
