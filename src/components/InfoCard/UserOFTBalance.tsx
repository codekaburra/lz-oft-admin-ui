import { useEffect, useState } from "react";
import { CHAINS } from "~/const/chains";
import { useWalletProvider } from "~/hooks/useWalletProvider";
import { formatBalance, getOFTContract } from "~/utils";
import { IERC20Balance } from "~/vite-env";
import { Loading, Row } from "./utils";
import { AddressExplorer } from "../Explorer";
import { useTokenSelector } from "~/hooks/useTokenSelectorProviderf";

export const UserOFTBalance = () => {
  const { selectedWallet, userAddress } = useWalletProvider();
  const { selectedToken } = useTokenSelector();
  const [oftUserBalance, setERC20UserBalance] = useState<IERC20Balance>();
  const chainId = selectedWallet?.chainId;

  useEffect(() => {
    if (!selectedWallet) return;
    if (!selectedWallet?.provider || !userAddress || !chainId || !selectedToken) return;
    getOFTContract(selectedWallet, selectedToken.addresses[chainId]).then((contract) => {
      if (contract) {
        Promise.all([contract.balanceOf(userAddress), contract.decimals(), contract.name(), contract.symbol()]).then(
          (result) => {
            if (result) {
              setERC20UserBalance({
                rawBalance: result[0].toString(),
                decimals: result[1].toString(),
                name: result[2].toString(),
                symbol: result[3].toString(),
              });
            }
          },
        );
      }
    });
  }, [chainId, selectedWallet, userAddress]);

  return (
    selectedToken && (
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-xl bg-white p-4 shadow sm:p-7 dark:bg-neutral-900">
          <div className="mb-8 text-center">
            <h4 className="text-lg font-bold text-gray-800 md:text-xl dark:text-neutral-200">
              User OFT Status
              {chainId && <p className="text-sm text-gray-600 dark:text-neutral-400">{CHAINS[chainId].chainName}</p>}
            </h4>
          </div>
          {selectedWallet && chainId && CHAINS[chainId] && (
            <>
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                  <Row title="Contract Address">
                    <AddressExplorer chainId={chainId} address={selectedToken.addresses[chainId]} />
                  </Row>
                  {!oftUserBalance && <Loading />}
                  {oftUserBalance && (
                    <Row
                      title="OFT Balance"
                      textRight={`${formatBalance(oftUserBalance.rawBalance, oftUserBalance.decimals)} ${oftUserBalance.symbol}`}
                    ></Row>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
};

export const CheckboxLabel = (props: { isChecked: boolean }) => {
  const { isChecked } = props;
  return (
    <span>
      {isChecked && (
        <svg
          className="me-2 h-3.5 w-3.5 flex-shrink-0 text-green-500 dark:text-green-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      )}
      {!isChecked && (
        <svg
          className="me-2 h-3.5 w-3.5 flex-shrink-0 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      )}
    </span>
  );
};
