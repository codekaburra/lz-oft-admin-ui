import { WalletProvider } from "~/hooks/WalletProvider";
import { TokenSelector } from "./hooks/TokenSelector";
import { Bridge } from "./components/Bridge";
import { UserBalance } from "./components/InfoCard/UserBalance";
import { NavBar } from "./components/nav/NavBar";
import { Mint } from "./components/Mint";
import { Burn } from "./components/Burn";
import { TokenEndpointStatus } from "./components/InfoCard/TokenEndpointStatus";
import { UserOFTBalance } from "./components/InfoCard/UserOFTBalance";

const App = () => {
  return (
    <div className="dark:bg-black">
      <WalletProvider>
        <div className="wrapper">
          <NavBar />
          <main>
            <TokenSelector>
              <div className="grid grid-flow-row-dense grid-cols-5">
                <div className="col-span-2">
                  <UserBalance />
                  <UserOFTBalance />
                </div>
                <div className="col-span-3">
                  <Bridge />
                </div>
              </div>
              <div className="grid grid-flow-row-dense grid-cols-4">
                <div className="col-span-2">
                  <Mint />
                </div>
                <div className="col-span-1">
                  <Burn />
                </div>
              </div>
              {/* <TokenStatus /> */}
              <TokenEndpointStatus />
            </TokenSelector>
          </main>
        </div>
      </WalletProvider>
    </div>
  );
};

export default App;
