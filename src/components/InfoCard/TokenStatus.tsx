import { useEffect, useState } from "react";
import { USDX_DECIMALS, OFT_CONFIGS_OLD } from "~/const/ofts";
import { formatBalance, getAllOFTStatus } from "~/utils";
import { IOFTStatus, IOFTStatusByChainId } from "~/vite-env";
import { Loading, Row } from "./utils";
import { AddressExplorer } from "../Explorer";
import { useTokenSelector } from "~/hooks/useTokenSelectorProviderf";
import { CHAINS } from "~/const/chains";
import { Endpoint } from "./Endpoint";

export const TokenStatus = () => {
  const { selectedToken } = useTokenSelector();
  const [oftStatusByChainId, setOFTStatusByChainId] = useState<IOFTStatusByChainId>();

  useEffect(() => {
    if (!selectedToken) return;
    getAllOFTStatus(selectedToken).then((data) => {
      data && setOFTStatusByChainId(data);
    });
  }, [selectedToken]);

  return (
    selectedToken && (
      <>
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-xl bg-white p-4 shadow sm:p-7 dark:bg-neutral-900">
            <div className="mb-4 items-center justify-between">
              <h5 className="text-l font-bold text-gray-900 dark:text-white">OFT Status</h5>
            </div>
            {oftStatusByChainId && (
              <div className={`grid grid-flow-row-dense grid-cols-${Object.keys(selectedToken.addresses).length + 1}`}>
                {Object.keys(oftStatusByChainId).map((chainId) => (
                  <div className="col-span-1" key={`TokenStatus${chainId}`}>
                    <Endpoint chainId={chainId} />
                    <OFTStatus chainId={chainId} oftStatus={oftStatusByChainId[chainId]} />
                  </div>
                ))}
              </div>
            )}
            {!oftStatusByChainId && <Loading />}
          </div>
        </div>
      </>
    )
  );
};

export const OFTStatus = (props: { oftStatus: IOFTStatus; chainId: string }) => {
  const { oftStatus, chainId } = props;
  return (
    <div className="flow-root">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        <Row
          title={CHAINS[chainId].chainName}
          textRight={<img src={CHAINS[chainId].icon} width="30" height="30" className="rounded-full" />}
        ></Row>
        <Row title="Contract Address">{OFT_CONFIGS_OLD[chainId].contractAddress}</Row>
        <Row title="Total Supply" textRight={formatBalance(oftStatus.totalSupply, USDX_DECIMALS)} />
        <Row title="Owner">
          <AddressExplorer chainId={chainId} address={oftStatus.owner} />
        </Row>
        <Row title="endpoint">
          <AddressExplorer chainId={chainId} address={oftStatus.endpoint} />
        </Row>
        <Row title="endpointDelegate">
          {/* <AddressExplorer chainId={chainId} address={oftStatus.endpointDelegate} /> */}
        </Row>
        <Row title="token">
          <AddressExplorer chainId={chainId} address={oftStatus.token} />
        </Row>
        <Row title="approvalRequired">{oftStatus.approvalRequired}</Row>
        <Row title="decimalConversionRate">{oftStatus.decimalConversionRate}</Row>
        <Row title="msgInspector">
          <AddressExplorer chainId={chainId} address={oftStatus.msgInspector} />
        </Row>
        <Row title="oApp">{oftStatus.oApp}</Row>
        <Row title="oAppVersion">{oftStatus.oAppVersion}</Row>
        <Row title="oftVersion">{oftStatus.oftVersion}</Row>
        <Row title="preCrime">{oftStatus.preCrime}</Row>
        <Row title="sharedDecimals">{oftStatus.sharedDecimals}</Row>
      </ul>
    </div>
  );
};
