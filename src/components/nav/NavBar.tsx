import { WalletList } from "./WalletList";
import { SelectedWallet } from "./SelectedWallet";
import { WalletError } from "./WalletError";
import { DarkModeToggle } from "./DarkModeToggle";

export const NavBar = () => {
  return (
    <>
      <nav className="border-neutral-200 bg-white dark:bg-neutral-900">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            LayerZero OFT Tools
          </span>
          <div className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
            <DarkModeToggle />
            <SelectedWallet />
            <WalletList />
            <WalletError />
          </div>
        </div>
        <div className="items-irght hidden w-full justify-between md:order-1 md:flex md:w-auto"></div>
      </nav>
    </>
  );
};
