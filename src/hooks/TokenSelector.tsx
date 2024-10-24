import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { CHAINS } from "~/const/chains";
import { getEndpointId } from "~/utils";
import { IChainIdToEndpointId, IOFTConfig, IOFTConfigs } from "~/vite-env";
import oftJson from "~/configs/ofts.json";

export interface TokenSelectorContext {
  oftConfigs: IOFTConfigs;
  selectedToken?: IOFTConfig;
  chainIdToEndpointId: IChainIdToEndpointId;
}

export const TokenSelectorContext = createContext<TokenSelectorContext>({
  chainIdToEndpointId: {},
  oftConfigs: {},
});

export const TokenSelector: React.FC<PropsWithChildren> = ({ children }) => {
  const [inputOftConfigs, setInputOFTConfigs] = useState<string>(JSON.stringify(oftJson));
  const [oftConfigs, setOFTConfigs] = useState<IOFTConfigs>({});
  const [selectedOftIndex, setSelectedOftIndex] = useState<string | undefined>(undefined);
  const [selectedToken, setSelectedToken] = useState<IOFTConfig | undefined>(undefined);
  const [chainIdToEndpointId, setChainIdToEndpointId] = useState<IChainIdToEndpointId>({});

  const handleInputOftConfigs = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputOFTConfigs(event.target.value);
  };

  const handleSelectedOftIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOftIndex(event.target.value);
  };

  useEffect(() => {
    const config: IOFTConfigs = JSON.parse(inputOftConfigs);
    setOFTConfigs(config);
  }, []);

  useEffect(() => {
    if (!selectedOftIndex) return;
    const oftConfig: IOFTConfig = oftConfigs[selectedOftIndex];
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
  }, [selectedOftIndex]);

  const contextValue: TokenSelectorContext = {
    selectedToken,
    chainIdToEndpointId,
    oftConfigs,
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
            {/* <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">Select the OFT</h3> */}
            <div className="grid grid-cols-2 border-t border-gray-200 py-6 first:border-transparent first:pt-0 last:pb-0 dark:border-neutral-700 dark:first:border-transparent">
              <div className="mt-2 space-y-3">
                <ul className="gap grid-span-2 w-full">
                  {Object.keys(oftConfigs).map((_, index) => (
                    <li key={`oft-${index}`}>
                      <input
                        type="radio"
                        id={`oft-${index}`}
                        name="hosting"
                        value={index}
                        className="peer hidden"
                        required
                        onChange={handleSelectedOftIndex}
                      />
                      <label
                        htmlFor={`oft-${index}`}
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
                      >
                        <div className="block">
                          <div className="w-full text-xs font-semibold">
                            {oftConfigs[index].name} ({oftConfigs[index].symbol})
                          </div>
                          <div className="w-full text-xs">{JSON.stringify(oftConfigs[index].addresses, null, 2)}</div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid-span-1 mt-2 space-y-3">
                <textarea
                  className="focus:border-dark-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 dark:border-gray-700 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  value={inputOftConfigs}
                  onChange={handleInputOftConfigs}
                  rows={20}
                />
              </div>
            </div>
          </form>
          {selectedToken &&
            Object.keys(selectedToken.addresses).map((chainId) => (
              <span
                key={CHAINS[chainId].chainName}
                className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                {CHAINS[chainId].chainName}
              </span>
            ))}
        </div>
      </div>
      {children}
    </TokenSelectorContext.Provider>
  );
};
