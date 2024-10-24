import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { CHAINS } from "~/const/chains";
import { useWalletProvider } from "~/hooks/useWalletProvider";
import { fetchBalance, formatBalance } from "~/utils";
import { Row } from "./utils";
import { AddressExplorer } from "../Explorer";

export const UserBalance = () => {
  const { selectedWallet, userAddress } = useWalletProvider();
  const [userBalance, setUserBalance] = useState<BigNumber>();
  const chainId = selectedWallet?.chainId;

  useEffect(() => {
    if (!selectedWallet) return;
    if (!selectedWallet?.provider || !userAddress || !chainId) return;
    fetchBalance(selectedWallet.provider, userAddress).then((balance) => {
      balance && setUserBalance(balance);
    });
  }, [chainId, selectedWallet, userAddress]);

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="rounded-xl bg-white p-4 shadow sm:p-7 dark:bg-neutral-900">
        <div className="mb-8 text-center">
          <h4 className="text-lg font-bold text-gray-800 md:text-xl dark:text-neutral-200">
            User Status
            {chainId && <p className="text-sm text-gray-600 dark:text-neutral-400">{CHAINS[chainId].chainName}</p>}
          </h4>
        </div>
        {selectedWallet && chainId && CHAINS[chainId] && (
          <>
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                <Row
                  title="User Address"
                  textRight={<img src={CHAINS[chainId].icon} width="30" height="30" className="rounded-full" />}
                >
                  <AddressExplorer chainId={chainId} address={userAddress} />
                </Row>
                <Row
                  title="Native Balance"
                  textRight={`${formatBalance(userBalance)} ${selectedWallet.chainId ? CHAINS[selectedWallet.chainId].nativeCurrency : "ETH"}`}
                />
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
