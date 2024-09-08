import { useWalletProvider } from "~/hooks/useWalletProvider";
import styles from "./SelectedWallet.module.css";

export const SelectedWallet = () => {
  const { selectedWallet, userAddress, disconnectWallet } = useWalletProvider();

  return (
    <>
      {selectedWallet && (
        <>
          <div className="mb-2 me-2 items-center px-5 py-2.5 text-center text-xs tracking-tighter text-gray-500 dark:text-gray-400">
            <div className={styles.selectedWallet}>
              <img src={selectedWallet?.info.icon} alt={selectedWallet?.info.name} />
              <div className="me-2">{selectedWallet?.info.name}</div>
              <span>Chain ID : {selectedWallet.chainId}</span>
            </div>
            <div>
              <p>{userAddress}</p>
            </div>
          </div>
          <button
            className="mb-2 me-2 inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </button>
        </>
      )}
    </>
  );
};
