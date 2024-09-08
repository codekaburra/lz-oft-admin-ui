import { useWalletProvider } from "~/hooks/useWalletProvider";
import { EIP6963ProviderDetail } from "~/vite-env";

export const WalletList = () => {
  const { selectedWallet, wallets, connectWallet } = useWalletProvider();
  return (
    <>
      {!selectedWallet && (
        <>
          <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow sm:p-6 dark:border-gray-700 dark:bg-gray-800">
            <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">Connect wallet</h5>
            <ul className="my-4 space-y-3">
              {Object.keys(wallets).length > 0 ? (
                Object.values(wallets).map((provider: EIP6963ProviderDetail) => (
                  <li>
                    <button
                      className="group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                      key={provider.info.uuid}
                      onClick={() => connectWallet(provider.info.rdns)}
                    >
                      <img className="-ms-1 me-2 h-5 w-6" src={provider.info.icon} alt={provider.info.name} />
                      <span className="ms-3 flex-1 whitespace-nowrap">{provider.info.name}</span>
                    </button>
                  </li>
                ))
              ) : (
                <div>there are no Announced Providers</div>
              )}
            </ul>
          </div>
        </>
      )}
    </>
  );
};
