import { useEffect, useState } from "react";
import { getEndpointStatus } from "~/utils/endpoint";
import { IEndpointStatus } from "~/vite-env";
import { Loading, Row } from "./utils";
import { AddressExplorer } from "../Explorer";
import { CHAIN_ID_TO_LZ_CHAIN_ID, CHAINS } from "~/const/chains";
import { LAYERZERO_CONFIGS } from "~/const/layerzero";

export const Endpoint = (props: { chainId: string }) => {
  const { chainId } = props;
  const [endpointStatus, setEndpointStatus] = useState<IEndpointStatus>();

  useEffect(() => {
    getEndpointStatus(chainId).then((data) => {
      data && setEndpointStatus(data);
    });
  }, [chainId]);

  return (
    chainId && (
      <>
        {endpointStatus && (
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              <Row
                title={CHAINS[chainId].chainName}
                textRight={<img src={CHAINS[chainId].icon} width="30" height="30" className="rounded-full" />}
              ></Row>
              <Row title="Endpoint Contract Address">
                <AddressExplorer
                  chainId={chainId}
                  address={LAYERZERO_CONFIGS[CHAIN_ID_TO_LZ_CHAIN_ID[chainId]].endpointV2}
                />
              </Row>
              <Row title="eid" textRight={endpointStatus.eid} />
              <Row title="delegates">
                <AddressExplorer chainId={chainId} address={endpointStatus.delegates} />
              </Row>
              <Row title="lzToken">
                <AddressExplorer chainId={chainId} address={endpointStatus.lzToken} />
              </Row>
              <Row title="nativeToken">
                <AddressExplorer chainId={chainId} address={endpointStatus.nativeToken} />
              </Row>
              {/* <Row title="getRegisteredLibraries">
                    <article className="text-wrap">
                    {endpointStatus.getRegisteredLibraries}
                    </article></Row> */}
              <Row title="getSendContext">{endpointStatus.getSendContext}</Row>
              <Row title="isSendingMessage">{endpointStatus.isSendingMessage}</Row>
              <Row title="owner">
                <AddressExplorer chainId={chainId} address={endpointStatus.owner} />
              </Row>
            </ul>
          </div>
        )}
        {!endpointStatus && <Loading />}
      </>
    )
  );
};
