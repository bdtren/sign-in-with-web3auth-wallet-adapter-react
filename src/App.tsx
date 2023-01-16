import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { GlowWalletAdapter, PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useMemo } from "react";
import SIWWLogo from "../public/siww-logo.png";
import Ethereum from "./Ethereum";
import Solana from "./Solana";
import Starkware from "./Starkware";
import { Web3AuthWalletAdapter } from "./Web3AuthWalletAdapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";

function App() {
  const wallets = useMemo(
    () => [
        new PhantomWalletAdapter(),    
        new SolflareWalletAdapter(),
        new SlopeWalletAdapter(),
        new GlowWalletAdapter(),
        new TorusWalletAdapter({
          params: {
            network: 'testnet',
          }
        }),
        new Web3AuthWalletAdapter({
          params: {
            clientId: '<your clientId from https://dashboard.web3auth.io/>',
            web3AuthNetwork: 'testnet',
            chainConfig: {
              chainNamespace: CHAIN_NAMESPACES.SOLANA,
              chainId: "0x2", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
              rpcTarget: "https://api.testnet.solana.com", // https://api.<network>.solana.com
            },
          }
        })
    ],
    [WalletAdapterNetwork.Mainnet]
  )
  const endpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Mainnet), [WalletAdapterNetwork.Mainnet])
  
  const [chain, setChain] = React.useState("solana");
  
  return (
    <>
      <img className='siwwlogo' src={SIWWLogo} />
      <div className="grid-container">
        <button className={chain=="ethereum"?"selected":"chainSelector"} onClick={()=>setChain("ethereum")}>Ethereum</button>
        <button className={chain=="solana"?"selected":"chainSelector"} onClick={()=>setChain("solana")}>Solana</button>
        <button className={chain=="starkware"?"selected":"chainSelector"} onClick={()=>setChain("starkware")}>Starkware</button>
      </div>
      
      <div className="main">
        {
          chain == "ethereum" &&
          <Ethereum />
        }
        {
          chain == "solana" &&
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                  <Solana />
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
        }
        {
          chain == "starkware" &&
          <Starkware/>
        }
        <div className="footer-wrapper">
          <img className='logo' src="https://app.tor.us/v1.22.2/img/web3auth.b98a3302.svg" />
        </div>
      </div>
    </>
  );
}

export default App;