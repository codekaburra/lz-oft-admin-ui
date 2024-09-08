import { BrowserProvider } from "ethers";
import { PropsWithChildren, createContext, useCallback, useEffect, useState } from "react";
import { EIP6963AnnounceProviderEvent, EIP6963ProviderDetailExtended, WalletError } from "~/vite-env";

// Context interface for the EIP-6963 provider.
export interface WalletProviderContext {
  wallets: Record<string, EIP6963ProviderDetailExtended>; // A list of wallets.
  selectedWallet?: EIP6963ProviderDetailExtended;
  userAddress?: string;
  errorMessage: string | null; // An error message.
  connectWallet: (walletUuid: string) => Promise<void>; // Function to connect wallets.
  disconnectWallet: () => void; // Function to disconnect wallets.
  clearError: () => void;
}

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }
}

const noop = () => {};
export const WalletProviderContext = createContext<WalletProviderContext>({
  wallets: {},
  errorMessage: null,
  connectWallet: async () => {},
  disconnectWallet: noop,
  clearError: noop,
});

// The WalletProvider component wraps all other components in the dapp, providing them with the
// necessary data and functions related to wallets.
export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [wallets, setWallets] = useState<Record<string, EIP6963ProviderDetailExtended>>({});
  const [selectedWalletRdns, setSelectedWalletRdns] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string>();

  const [errorMessage, setErrorMessage] = useState("");
  const clearError = () => setErrorMessage("");
  const setError = (error: string) => setErrorMessage(error);

  useEffect(() => {
    const savedSelectedWalletRdns = localStorage.getItem("selectedWalletRdns");

    function onAnnouncement(event: EIP6963AnnounceProviderEvent) {
      const wallet = event.detail;
      const provider = new BrowserProvider(wallet.provider);
      provider.getNetwork().then((_) => {
        setWallets((currentWallets) => ({
          ...currentWallets,
          [event.detail.info.rdns]: { ...wallet, chainId: _.chainId.toString() },
        }));
      });
      // provider.on("chainChanged", () => window.location.reload());
      // provider.on("accountsChanged", (accounts: string[]) => {
      //   setUserAddress(accounts[0]);
      //   console.log("accountsChanged", accounts);
      // });
      if (savedSelectedWalletRdns && event.detail.info.rdns === savedSelectedWalletRdns) {
        setSelectedWalletRdns(savedSelectedWalletRdns);
      }
    }
    window.addEventListener("eip6963:announceProvider", onAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => window.removeEventListener("eip6963:announceProvider", onAnnouncement);
  }, []);

  useEffect(() => {
    if (!selectedWalletRdns) return undefined;
    const wallet = wallets[selectedWalletRdns];
    if (!wallet) return undefined;

    const provider = new BrowserProvider(wallet.provider);
    provider
      .getSigner()
      .then(({ address }) => setUserAddress(address))
      .catch((e) => {
        console.error(e);
      });
  }, [wallets, selectedWalletRdns]);

  const connectWallet = useCallback(
    async (walletRdns: string) => {
      try {
        const wallet = wallets[walletRdns];
        setSelectedWalletRdns(wallet.info.rdns);
        localStorage.setItem("selectedWalletRdns", wallet.info.rdns);
      } catch (error) {
        console.error("Failed to connect to provider:", error);
        const walletError = error as WalletError;
        setError(`Code: ${walletError.code} \nError Message: ${walletError.message}`);
      }
    },
    [wallets],
  );

  const disconnectWallet = useCallback(async () => {
    if (selectedWalletRdns) {
      const wallet = wallets[selectedWalletRdns];
      setSelectedWalletRdns(null);
      localStorage.removeItem("selectedWalletRdns");

      try {
        await wallet.provider.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      } catch (error) {
        console.error("Failed to revoke permissions:", error);
      }
    }
  }, [selectedWalletRdns, wallets]);

  const contextValue: WalletProviderContext = {
    wallets,
    selectedWallet: selectedWalletRdns ? wallets[selectedWalletRdns] : undefined,
    userAddress,
    errorMessage,
    connectWallet,
    disconnectWallet,
    clearError,
  };

  return <WalletProviderContext.Provider value={contextValue}>{children}</WalletProviderContext.Provider>;
};
