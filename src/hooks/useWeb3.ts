import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useAppDispatch } from '../contexts/AppContext';
import {
  saveWalletConnection,
  clearWalletConnection,
  shouldAutoReconnect,
} from '../utils/walletStorage';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // eslint-disable-next-line no-undef
      infuraId: process.env.REACT_APP_INFURA_ID,
      rpc: {
        1: 'https://eth-mainnet.g.alchemy.com/v2/demo', // Ethereum mainnet for GBGN
        42161: 'https://arb1.arbitrum.io/rpc', // Arbitrum One for NBGN/DBGN
      },
      chainId: 42161, // Default to Arbitrum
    },
  },
};

const web3Modal = new Web3Modal({
  // eslint-disable-next-line no-undef
  network: process.env.REACT_APP_NETWORK || 'arbitrum',
  cacheProvider: true,
  providerOptions,
});

export const useWeb3 = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(true); // Track initial reconnection state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawProvider, setRawProvider] = useState<any>(null);
  const dispatch = useAppDispatch();

  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      console.log('🔄 Account change detected:', accounts);

      if (accounts.length === 0) {
        console.log('🚫 No accounts - disconnecting');
        // Clear local state when accounts are disconnected
        web3Modal.clearCachedProvider();
        clearWalletConnection(); // Clear our custom storage too
        setProvider(null);
        setAccount(null);
        setRawProvider(null);
        dispatch({ type: 'DISCONNECT' });
      } else {
        // Update account and refresh user state
        const newAccount = accounts[0];
        console.log('👤 New account:', newAccount, 'Previous:', account);

        // Always update to ensure state consistency
        setAccount(newAccount);

        // Update global state with new address immediately
        dispatch({
          type: 'SET_USER',
          payload: {
            address: newAccount,
            balance: '0', // Will be updated by useNBGN hook
          },
        });

        // Force refresh of Web3 connection state to trigger re-renders
        dispatch({
          type: 'SET_WEB3',
          payload: { connected: true, provider },
        });

        console.log('✅ Account updated in global state');
      }
    },
    [dispatch, account, provider]
  );

  const handleChainChanged = useCallback(async (chainHex: string) => {
    const newChainId = parseInt(chainHex, 16);
    setChainId(newChainId);

    // Still reload for now to ensure clean state
    // eslint-disable-next-line no-undef
    window.location.reload();
  }, []);

  const connectWallet = useCallback(
    async (isAutoReconnect = false) => {
      if (!isAutoReconnect) {
        setLoading(true);
      }

      try {
        const connection = await web3Modal.connect();
        const provider = new BrowserProvider(connection);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        setProvider(provider);
        setAccount(address);
        setChainId(Number(network.chainId));
        setRawProvider(connection); // Store raw provider for disconnect

        // Save wallet connection state for persistence
        const providerName = connection.constructor.name || 'unknown';
        saveWalletConnection(providerName);

        // Initial dispatch with address only - NBGN balance will be fetched by useNBGN hook
        dispatch({
          type: 'SET_USER',
          payload: {
            address,
            balance: '0', // Will be updated by useNBGN hook
          },
        });

        dispatch({
          type: 'SET_WEB3',
          payload: { connected: true, provider },
        });

        // Remove any existing listeners first
        if (connection.removeAllListeners) {
          connection.removeAllListeners('accountsChanged');
          connection.removeAllListeners('chainChanged');
        }

        // Add fresh listeners
        connection.on('accountsChanged', handleAccountsChanged);
        connection.on('chainChanged', handleChainChanged);
        console.log('🎧 Event listeners attached for account/chain changes');
      } catch (error) {
        // eslint-disable-next-line no-console, no-undef
        console.error('Connection failed:', error);

        // Clear cached provider if connection failed
        if (isAutoReconnect) {
          web3Modal.clearCachedProvider();
          clearWalletConnection();
        }
      } finally {
        setLoading(false);
        setIsReconnecting(false);
      }
    },
    [dispatch, handleAccountsChanged, handleChainChanged]
  );

  const disconnectWallet = useCallback(async () => {
    try {
      // Properly close the raw provider connection if it exists
      if (rawProvider) {
        // For WalletConnect providers
        if (rawProvider.disconnect) {
          await rawProvider.disconnect();
        }

        // For providers that have close method
        if (rawProvider.close) {
          await rawProvider.close();
        }

        // Remove event listeners
        if (rawProvider.removeAllListeners) {
          rawProvider.removeAllListeners();
        }
      }

      // Clear Web3Modal cache
      web3Modal.clearCachedProvider();

      // Clear our custom wallet connection storage
      clearWalletConnection();

      // Reset local state
      setProvider(null);
      setAccount(null);
      setRawProvider(null);

      // Reset global state
      dispatch({ type: 'DISCONNECT' });
    } catch (error) {
      // eslint-disable-next-line no-console, no-undef
      console.warn('Error during disconnect:', error);

      // Still proceed with state cleanup even if provider disconnect fails
      web3Modal.clearCachedProvider();
      clearWalletConnection();
      setProvider(null);
      setAccount(null);
      setRawProvider(null);
      dispatch({ type: 'DISCONNECT' });
    }
  }, [dispatch, rawProvider]);

  // Auto-connect on app load if provider was cached and user previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const shouldReconnect = shouldAutoReconnect();
      const hasCachedProvider = web3Modal.cachedProvider;

      if (hasCachedProvider && shouldReconnect && !provider) {
        // eslint-disable-next-line no-console, no-undef
        console.log('🔄 Auto-reconnecting to previous wallet...');
        await connectWallet(true); // Pass true to indicate this is auto-reconnect
      } else {
        // Not reconnecting, set loading state to false
        setIsReconnecting(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    void autoConnect();
  }, [connectWallet, provider]);

  const switchToArbitrum = useCallback(async () => {
    if (!rawProvider) return;

    try {
      await rawProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4b1' }], // Arbitrum One chain ID in hex
      });
    } catch (switchError: unknown) {
      // This error code indicates that the chain has not been added to MetaMask
      if ((switchError as any)?.code === 4902) {
        try {
          await rawProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xa4b1',
                chainName: 'Arbitrum One',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://arbiscan.io/'],
              },
            ],
          });
        } catch {
          // Failed to add Arbitrum network
        }
      } else {
        // Failed to switch to Arbitrum
      }
    }
  }, [rawProvider]);

  return {
    provider,
    account,
    chainId,
    loading,
    isReconnecting,
    connectWallet: (isAutoReconnect?: boolean) =>
      connectWallet(isAutoReconnect),
    disconnectWallet,
    switchToArbitrum,
  };
};
