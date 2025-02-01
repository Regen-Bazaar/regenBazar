import { ethers } from 'ethers';

// Base Testnet configuration
export const BASE_TESTNET = {
  chainId: '0x14a34',  // 84532 in decimal
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.base.org']
};

let provider: ethers.BrowserProvider | null = null;
let connectionAttempts = 0;
const MAX_ATTEMPTS = 3;

async function switchToBaseTestnet(): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_TESTNET.chainId }],
    });
    return true;
  } catch (switchError: any) {
    if (switchError.code === 4001) {
      throw new Error('Please switch to Base Testnet to continue');
    }
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [BASE_TESTNET],
        });
        return true;
      } catch (addError: any) {
        if (addError.code === 4001) {
          throw new Error('Please add Base Testnet to continue');
        }
        throw new Error('Failed to add Base Testnet. Please try again.');
      }
    }
    throw new Error('Failed to switch to Base Testnet. Please try again.');
  }
}

export async function connectWallet(walletType: string = 'metamask', manualAddress?: string): Promise<string | null> {
  // If manual address is provided, return it directly
  if (walletType === 'manual' && manualAddress) {
    return manualAddress;
  }

  try {
    // Check for ethereum provider based on wallet type
    let ethereum = window.ethereum;
    
    if (!ethereum) {
      if (walletType === 'metamask') {
        throw new Error('Please install MetaMask to continue');
      } else if (walletType === 'coinbase') {
        // Check for Coinbase Wallet specific provider
        if (window.coinbaseWalletExtension) {
          ethereum = window.coinbaseWalletExtension;
        } else {
          throw new Error('Please install Coinbase Wallet to continue');
        }
      } else {
        throw new Error('Please install a Web3 wallet to continue');
      }
    }

    // Check for specific wallet based on type
    if (walletType === 'metamask' && !ethereum.isMetaMask) {
      throw new Error('Please use MetaMask to connect');
    } else if (walletType === 'coinbase' && !ethereum.isCoinbaseWallet) {
      throw new Error('Please use Coinbase Wallet to connect');
    }

    if (connectionAttempts >= MAX_ATTEMPTS) {
      throw new Error('Maximum connection attempts reached. Please try again later.');
    }

    connectionAttempts++;

    // Initialize provider with the correct ethereum instance
    provider = new ethers.BrowserProvider(ethereum);

    // Switch to Base Testnet
    await switchToBaseTestnet();

    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet');
      }

      // Reset connection attempts on success
      connectionAttempts = 0;
      return accounts[0];
    } catch (error: any) {
      // Handle user rejection specifically
      if (error.code === 4001) {
        connectionAttempts = 0; // Reset attempts for user rejections
        return null; // Return null instead of throwing for user rejections
      }
      throw error;
    }
  } catch (error: any) {
    // Reset connection attempts for specific errors
    if (error.code === 4001 || error.message.includes('Please install')) {
      connectionAttempts = 0;
    }
    throw error;
  }
}

export function subscribeToAccountChanges(callback: (account: string | null) => void): void {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      callback(accounts[0] || null);
    });

    window.ethereum.on('chainChanged', async () => {
      provider = null;
      connectionAttempts = 0;
      window.location.reload();
    });
  }
}

export function getProvider(): ethers.BrowserProvider | null {
  return provider;
}

export function resetConnectionAttempts(): void {
  connectionAttempts = 0;
}