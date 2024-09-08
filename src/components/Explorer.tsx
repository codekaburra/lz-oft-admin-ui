import { CHAINS } from "~/const/chains";

export const TransactionExplorer = (props: { chainId?: string; hash?: string }) => {
  const { chainId, hash } = props;
  return (
    chainId &&
    hash && (
      <>
        <div className="flex items-center gap-2">
          <a
            className="text-sm text-gray-500 no-underline hover:underline dark:text-gray-400"
            href={`${CHAINS[chainId].explorer}tx/${hash}`}
            target="_blank"
          >
            <span>{props.hash}</span>
          </a>
          <a href={`https://testnet.layerzeroscan.com/tx/${hash}`} target="_blank" className="relative cursor-pointer">
            <span className="text-gray-500">
              <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.67 8a6.667 6.667 0 1 0-6.667 6.666m.666-13.3s2 2.634 2 6.634" stroke="currentColor"></path>
                <path
                  d="M7.997 10.833h.5v-1h-.5v1Zm-.667 3.8.398-.302-.002-.004a1.396 1.396 0 0 1-.07-.098 7.103 7.103 0 0 1-.21-.33 10.584 10.584 0 0 1-.657-1.28 11.69 11.69 0 0 1-.959-4.62h-1c0 2.084.52 3.81 1.04 5.015.261.603.522 1.078.72 1.404a8.065 8.065 0 0 0 .339.513l.002.003a.01.01 0 0 1 0 .001l.399-.302ZM5.83 8c0-1.917.48-3.507.96-4.619.239-.555.478-.99.655-1.282a7.092 7.092 0 0 1 .28-.427l.003-.004-.398-.302-.398-.302-.001.001-.002.003a1.71 1.71 0 0 0-.027.036l-.07.1a8.06 8.06 0 0 0-.242.377c-.198.326-.459.8-.72 1.404A12.69 12.69 0 0 0 4.83 8h1Zm-4.08 2.833h6.247v-1H1.75v1Zm0-4.667h12.493v-1H1.75v1Z"
                  fill="currentColor"
                ></path>
                <path d="m14 10.73-4 4" stroke="currentColor"></path>
                <path d="M10.998 10.287h3.463v3.463" stroke="currentColor" strokeLinecap="square"></path>
              </svg>
            </span>
          </a>
        </div>
      </>
    )
  );
};
export const AddressExplorer = (props: { chainId?: string; address?: string }) => {
  if (!props.chainId) return <>{props.address}</>;
  return (
    props.chainId &&
    props.address && (
      <a
        className="no-underline hover:underline"
        href={`${CHAINS[props.chainId].explorer}address/${props.address}`}
        target="_blank"
      >
        {props.address}
      </a>
    )
  );
};
