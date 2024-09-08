import { useState } from "react";
import { useWalletProvider } from "~/hooks/useWalletProvider";
import { getOFTContract, toBaseUnit } from "~/utils";
import { TransactionExplorer } from "./Explorer";
import { USDX_DECIMALS } from "~/const/ofts";

interface IBurnTransfer {
  amount: string;
  transactionHash?: string;
}

export const Burn = () => {
  const { selectedWallet, userAddress } = useWalletProvider();
  const chainId = selectedWallet?.chainId;
  const [transfers, setTransfers] = useState<IBurnTransfer[]>([]);
  const [amount, setAmount] = useState<string>();

  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedWallet && amount && userAddress) {
      getOFTContract(selectedWallet).then((contract) => {
        if (contract) {
          const transfer: IBurnTransfer = {
            amount,
          };
          setTransfers([transfer, ...transfers]);
          contract.burn(toBaseUnit(amount, USDX_DECIMALS).toString(10)).then((txn) => {
            transfer.transactionHash = txn.hash;
          });
        }
      });
    }
  };

  return (
    chainId && (
      <>
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-xl bg-white p-4 shadow sm:p-7 dark:bg-neutral-900">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-neutral-200">Burn</h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Burn OFT from signer address</p>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="border-t border-gray-200 py-6 first:border-transparent first:pt-0 last:pb-0 dark:border-neutral-700 dark:first:border-transparent">
                <div className="mt-2 space-y-3">
                  <input
                    type="text"
                    className="focus:border-dark-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 dark:border-gray-700 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Amount"
                    name="amount"
                    value={amount}
                    onChange={handleAmount}
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-center gap-x-2">
                <button
                  type="submit"
                  className="group relative mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-200 group-hover:from-purple-500 group-hover:to-pink-500 dark:text-white dark:focus:ring-purple-800"
                >
                  <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                    Submit
                  </span>
                </button>
              </div>
            </form>
          </div>
          {transfers.length > 0 && (
            <div className="relative w-full">
              <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-neutral-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((_, index) => (
                    <tr className="border-b bg-white dark:border-neutral-700 dark:bg-gray-800">
                      <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {index}
                      </th>
                      <td className="px-6 py-4">
                        <p>
                          <TransactionExplorer chainId={chainId} hash={_.transactionHash} />
                        </p>
                      </td>
                      <td className="px-6 py-4">{_.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    )
  );
};
