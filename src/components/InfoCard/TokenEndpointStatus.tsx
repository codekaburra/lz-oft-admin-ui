import { useEffect, useState } from "react";
import { getAllOFTEndpointStatus, getAllOFTStatus } from "~/utils";
import { IOFTEndpointStatusByChainId, IOFTStatusByChainId } from "~/vite-env";
import { Loading, OnOffLabel } from "./utils";
import { useTokenSelector } from "~/hooks/useTokenSelectorProviderf";
import { CHAINS } from "~/const/chains";
import { Card } from "./Card";
import { Endpoint } from "./Endpoint";
import { OFTStatus } from "./TokenStatus";

export const TokenEndpointStatus = () => {
  const { selectedToken, chainIdToEndpointId } = useTokenSelector();
  const [oftEndpointStatusByChainId, setOFTEndpointStatusByChainId] = useState<IOFTEndpointStatusByChainId>();
  const [oftStatusByChainId, setOFTStatusByChainId] = useState<IOFTStatusByChainId>();
  const [columnSize, setColumnSize] = useState<number>();

  useEffect(() => {
    if (!selectedToken) return;
    getAllOFTStatus(selectedToken).then((data) => {
      data && setOFTStatusByChainId(data);
    });
    setColumnSize(Object.keys(selectedToken.addresses).length);
  }, [selectedToken]);

  useEffect(() => {
    if (!selectedToken) return;
    getAllOFTEndpointStatus(selectedToken, chainIdToEndpointId).then((data) => {
      console.log(data);
      data && setOFTEndpointStatusByChainId(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken]);

  return (
    selectedToken && (
      <>
        <Card title="OFT Status" subTitle="OFT & Endpoint Details">
          {oftStatusByChainId && (
            <div className={`grid grid-flow-row-dense grid-cols-${columnSize}`}>
              <div
                className={`text-center text-lg font-bold text-gray-800 md:text-3xl dark:text-neutral-200 col-span-${columnSize}`}
                key={`EndpointStatus`}
              ></div>
              {Object.keys(oftStatusByChainId).map((chainId) => (
                <div className="col-span-1" key={`EndpointStatus${chainId}`}>
                  <Endpoint chainId={chainId} />
                </div>
              ))}
              <div
                className={`text-center text-lg font-bold text-gray-800 md:text-3xl dark:text-neutral-200 col-span-${columnSize}`}
                key={`TokenStatus`}
              >
                OFT Status
              </div>
              {Object.keys(oftStatusByChainId).map((chainId) => (
                <div className="col-span-1" key={`TokenStatus${chainId}`}>
                  <OFTStatus chainId={chainId} oftStatus={oftStatusByChainId[chainId]} />
                </div>
              ))}
            </div>
          )}
          {!oftStatusByChainId && <Loading />}
          {oftEndpointStatusByChainId && <OFTEndpointStatus oftEndpointStatusByChainId={oftEndpointStatusByChainId} />}
          {!oftEndpointStatusByChainId && <Loading />}
        </Card>
      </>
    )
  );
};

export const OFTEndpointStatus = (props: { oftEndpointStatusByChainId: IOFTEndpointStatusByChainId }) => {
  const { oftEndpointStatusByChainId } = props;
  return (
    <div className="mx-auto max-w-full rounded-xl bg-white p-4 px-4 py-10 shadow sm:p-7 sm:px-6 lg:px-8 lg:py-14 dark:bg-neutral-900">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-neutral-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Chain
            </th>
            {Object.keys(oftEndpointStatusByChainId).map((chainId) => (
              <th scope="col" className="px-6 py-3">
                {CHAINS[chainId].chainName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(oftEndpointStatusByChainId).map((chainId) => {
            const oftEndpointStatus = oftEndpointStatusByChainId[chainId];
            return (
              <tr
                className="border-b bg-white dark:border-neutral-700 dark:bg-gray-800"
                key={`oftEndpointStatus${chainId}`}
              >
                <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {CHAINS[chainId].chainName}
                </th>
                {Object.keys(oftEndpointStatusByChainId).map((chainId) => (
                  <td scope="col" className="px-6 py-3">
                    <OnOffLabel isAbled={oftEndpointStatus.peerSetting[chainId].isPeer} />
                    <span className="text-xs">{oftEndpointStatus.peerSetting[chainId].enforcedOptions}</span>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
