import { dataSlice, ethers, getAddress } from "ethers";
import { useEffect, useState } from "react";
import { CHAINS } from "~/const/chains";
import { USDX_DECIMALS } from "~/const/ofts";
import { useWalletProvider } from "~/hooks/useWalletProvider";
import { formatBalance, getEndpointId, getOFTContract, getOFTQuoteSend, toBaseUnit } from "~/utils";
import { ILZMessageFee, ILZSendCallParam } from "~/vite-env";
import { TransactionExplorer } from "./Explorer";
import BigNumber from "bignumber.js";
import { useTokenSelector } from "~/hooks/useTokenSelectorProviderf";

export const Bridge = () => {
  const { selectedWallet, userAddress } = useWalletProvider();
  const { selectedToken } = useTokenSelector();
  const [transfers, setTransfers] = useState<ILZSendCallParam[]>([]);
  const [amount, setAmount] = useState<string>();
  const [contractAddress, setContractAdderss] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [fromChainId, setFromChainId] = useState<string>();
  const [toChainId, setToChainId] = useState<string>();
  const [inputAddress, setInputAddress] = useState<string>();
  const [messageFee, setMessageFee] = useState<ILZMessageFee>();
  const [refundAddress, setRefundAddress] = useState<string>();
  const [dstEid, setDstEid] = useState<string>();

  useEffect(() => {
    if (!selectedWallet) return;
    if (!selectedWallet?.provider || !userAddress || !selectedWallet.chainId) return;
    setFromChainId(selectedWallet.chainId);
    const address = selectedToken?.addresses[selectedWallet.chainId];
    if (address) {
      setContractAdderss(address);
      setErrorMessage(undefined);
    } else {
      setErrorMessage("Contract Address for this chain is not provided");
    }
  }, [selectedWallet, userAddress]);

  useEffect(() => {
    if (!selectedWallet) return;
    if (!selectedWallet?.provider || !selectedWallet.chainId || !toChainId) return;
    getEndpointId(toChainId).then((eid: string | void) => {
      if (eid) {
        setDstEid(eid.toString());
      }
    });
  }, [selectedWallet, toChainId]);

  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleFromChainId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFromChainId(event.target.value);
  };

  const handleToChainId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setToChainId(event.target.value);
  };

  const handleInputAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAddress(event.target.value);
  };

  const handleRefundAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRefundAddress(event.target.value);
  };

  useEffect(() => {
    estimateFee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet, fromChainId, toChainId, fromChainId, amount, inputAddress]);

  const buildSendParam = () => {
    if (selectedWallet && fromChainId && toChainId && amount && inputAddress && dstEid) {
      const sendParam = {
        dstEid,
        to: ethers.zeroPadValue(inputAddress, 32),
        amountLD: toBaseUnit(amount, USDX_DECIMALS).toString(10),
        minAmountLD: toBaseUnit(amount, USDX_DECIMALS).toString(10),
        extraOptions: "0x",
        composeMsg: "0x",
        oftCmd: "0x",
      };
      return sendParam;
    }
  };

  const estimateFee = () => {
    if (selectedWallet && fromChainId && toChainId && amount && inputAddress && contractAddress) {
      const sendParam = buildSendParam();
      if (sendParam) {
        getOFTQuoteSend(selectedWallet, contractAddress, sendParam).then((messageFee) => {
          if (messageFee) {
            setMessageFee(messageFee);
          }
        });
      }
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      selectedWallet &&
      fromChainId &&
      toChainId &&
      amount &&
      inputAddress &&
      messageFee &&
      refundAddress &&
      contractAddress
    ) {
      const sendParam = buildSendParam();
      if (sendParam) {
        const transfer: ILZSendCallParam = {
          sendParam,
          messageFee,
          refundAddress,
        };
        if (transfer) {
          setTransfers([transfer, ...transfers]);
          getOFTContract(selectedWallet, contractAddress).then((contract) => {
            if (contract) {
              contract
                .send(transfer.sendParam, transfer.messageFee, transfer.refundAddress, {
                  value: new BigNumber(transfer.messageFee.nativeFee).toString(10),
                })
                .then((txn: { hash: string | undefined }) => {
                  console.log(txn);
                  transfer.transactionHash = txn.hash;
                  setTransfers([transfer, ...transfers]);
                });
            }
          });
        }
      }
    }
  };

  return (
    selectedWallet?.chainId && (
      <>
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-xl bg-white p-4 shadow sm:p-7 dark:bg-neutral-900">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-neutral-200">Bridge</h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Bridge OFT via LayerZero</p>
            </div>

            <div className="text-sm text-red-600">
              {errorMessage && (
                <div>
                  <strong>Error:</strong> {errorMessage}
                </div>
              )}
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="border-t border-gray-200 py-6 first:border-transparent first:pt-0 last:pb-0 dark:border-neutral-700 dark:first:border-transparent">
                <div className="mt-2 space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                      className="focus:border-dark-500 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:ring-blue-500 dark:border-zinc-600 dark:bg-neutral-800 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={selectedWallet.chainId}
                      onChange={handleFromChainId}
                      disabled
                    >
                      <option></option>
                      {Object.keys(CHAINS).map((chainId, index) => (
                        <option value={chainId} key={index}>
                          {CHAINS[chainId].chainName} ({chainId})
                        </option>
                      ))}
                    </select>
                    <img src="/arrow-right.svg" width="20px" className="dark:invert" />
                    <select
                      className="focus:border-dark-500 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:ring-blue-500 dark:border-zinc-600 dark:bg-neutral-800 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={toChainId}
                      onChange={handleToChainId}
                    >
                      <option></option>
                      {Object.keys(CHAINS).map(
                        (chainId, index) =>
                          fromChainId &&
                          CHAINS[fromChainId] &&
                          chainId != fromChainId &&
                          CHAINS[fromChainId].isTestnet === CHAINS[chainId].isTestnet && (
                            <option value={chainId} key={index}>
                              {CHAINS[chainId].chainName} ({chainId})
                            </option>
                          ),
                      )}
                    </select>
                  </div>
                  <div className="mt-2 space-y-3">
                    <input
                      type="text"
                      className="focus:border-dark-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 dark:border-gray-700 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="To Address"
                      name="inputAddress"
                      value={inputAddress}
                      onChange={handleInputAddress}
                    />
                  </div>
                  <input
                    type="text"
                    className="focus:border-dark-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 dark:border-gray-700 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Amount"
                    name="amount"
                    value={amount}
                    onChange={handleAmount}
                  />
                </div>
                <div className="mt-2 space-y-3">
                  <input
                    type="text"
                    className="focus:border-dark-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 dark:border-gray-700 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Refund Address"
                    name="refundAddress"
                    value={refundAddress}
                    onChange={handleRefundAddress}
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-center gap-x-2">
                <button
                  className="group relative mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-zinc-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-200 group-hover:from-purple-500 group-hover:to-pink-500 dark:text-white dark:focus:ring-purple-800"
                  onClick={estimateFee}
                >
                  <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                    Estimate
                  </span>
                </button>
                <button
                  type="submit"
                  className="group relative mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 text-sm font-medium text-zinc-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-200 group-hover:from-purple-500 group-hover:to-pink-500 dark:text-white dark:focus:ring-purple-800"
                  disabled={!messageFee}
                >
                  <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-zinc-900">
                    Submit
                  </span>
                </button>
              </div>
              <div className="mt-2 flex justify-center gap-x-2">
                {messageFee && (
                  <ul className="max-w-md list-inside list-disc space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                    <li>
                      Native Fee: {formatBalance(messageFee.nativeFee)} {CHAINS[selectedWallet.chainId].nativeCurrency}
                    </li>
                    <li>ZRO Fee: {formatBalance(messageFee.lzTokenFee)}</li>
                  </ul>
                )}
              </div>
            </form>
          </div>
        </div>

        {transfers.length > 0 && (
          <div className="mx-auto max-w-full rounded-xl bg-white p-4 px-4 py-10 shadow sm:p-7 sm:px-6 lg:px-8 lg:py-14 dark:bg-neutral-900">
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-neutral-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3">
                    Param
                  </th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((_, index) => (
                  <tr
                    className="border-b bg-white dark:border-neutral-700 dark:bg-gray-800"
                    key={`bridgehistory${index}`}
                  >
                    <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {index}
                    </th>
                    <td className="px-6 py-4">
                      <p>dstEid {_.sendParam.dstEid}</p>
                      <p>{getAddress(dataSlice(_.sendParam.to, 12))}</p>
                      <p>nativeFee {formatBalance(_.messageFee.nativeFee)}</p>
                      <p>----</p>
                      <p>
                        <TransactionExplorer chainId={selectedWallet.chainId} hash={_.transactionHash} />
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <article className="text-wrap">
                        <p>{JSON.stringify(_, null, 2)}</p>
                      </article>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    )
  );
};
