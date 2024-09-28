import Image from "next/image";
import localFont from "next/font/local";
import {Badge, Box, Button, Container, Flex, Heading, Section} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import {EIP6963EventNames, LOCAL_STORAGE_KEYS, SupportedChainId, isPreviouslyConnectedProvider, isSupportedChain, switchChain,} from "./config";
import {CodeSandboxLogoIcon, DrawingPinIcon, RocketIcon} from "@radix-ui/react-icons";
import WalletButton from "./components/WalletButtons";





export default function Home() {

    const [injectedProviders, setInjectedProviders] = useState("");


    const [connection, setConnection] = useState(null);


    useEffect(() => {
        const onAnnounceProvider = () => {
            const { icon, rdns, uuid, name } = event.detail.info;

            if (!icon || !rdns || !uuid || !name) {
                console.error("invalid eip6963 provider info received!");
                return;
            }
            setInjectedProviders((prevProviders) => {
                const providers = new Map(prevProviders);
                providers.set(uuid, event.detail);
                return providers;
            });


            if (isPreviouslyConnectedProvider(rdns)) {
                handleConnectProvider(event.detail);
            }
        };

        // Add event listener for EIP-6963 announce provider event
        window.addEventListener();

        // Dispatch the request for EIP-6963 provider
        window.dispatchEvent(new Event(EIP6963EventNames.Request));

        // Clean up by removing the event listener and resetting injected providers
        return () => {
            window.removeEventListener()
        };
    }, []);

    
    async function handleConnectProvider(
        selectedProviderDetails: EIP6963ProviderDetail
    ) {
        const { provider, info } = selectedProviderDetails;
        try {
            const accounts = (await provider.request({
                method: "eth_requestAccounts",
            })) as string[];
            const chainId = await provider.request({ method: "eth_chainId" });
            setConnection({
                providerUUID: info.uuid,
                accounts,
                chainId: Number(chainId),
            });
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.PREVIOUSLY_CONNECTED_PROVIDER_RDNS,
                info.rdns
            );
        } catch (error) {
            console.error(error);
            throw new Error("Failed to connect to provider");
        }
    }

   
    const handleSwitchChain = async () => {
        try {
            if (!connection) return;
            const provider = injectedProviders.get(
                connection.providerUUID
            )!.provider;
            const chain = isSupportedChain(connection.chainId)
                ? connection.chainId === SupportedChainId.SEPOLIA
                    ? SupportedChainId.NAHMII3_TESTNET
                    : SupportedChainId.SEPOLIA
                : SupportedChainId.SEPOLIA;
            await switchChain(chain, provider);
            setConnection({
                ...connection,
                chainId: chain,
            });
        } catch (error) {
            console.error(error);
        }
    };

    
    const handleDisconnect = () => {
        setConnection(null);
        localStorage.removeItem(
            LOCAL_STORAGE_KEYS.PREVIOUSLY_CONNECTED_PROVIDER_RDNS
        );
    };

    const connectedInjectectProvider =
        connection && injectedProviders.get(connection.providerUUID);

        
  return (
   <div>
    <div></div>
   </div>
  );
}
