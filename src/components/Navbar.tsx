import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User } from 'lucide-react';
import { connectWallet, subscribeToAccountChanges } from '../lib/web3';
import toast from 'react-hot-toast';
import WalletModal from './WalletModal';

const Navbar = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    subscribeToAccountChanges((newAccount) => {
      setAccount(newAccount);
      if (!newAccount) {
        toast.error('Wallet disconnected');
      }
    });
  }, []);

  const handleConnectWallet = async (walletType: string, manualAddress?: string) => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      const address = await connectWallet(walletType, manualAddress);
      if (address) {
        setAccount(address);
        toast.success('Wallet connected successfully!');
        setIsWalletModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleProfileClick = () => {
    if (!account) {
      toast.error('Please connect your wallet to view profile');
      return;
    }
    navigate('/profile');
  };

  return (
    <nav className="bg-black/90 border-b border-gray-800 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-[#B4F481]" />
              <span className="ml-2 text-xl font-bold text-white">Regen Bazaar</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/projects" 
                className="bg-[#1D211A] text-gray-400 px-6 py-3 rounded-md hover:bg-[#2A462C] hover:text-gray-200 transition-colors"
              >
                Projects
              </Link>
              <Link 
                to="/organizations" 
                className="bg-[#1D211A] text-gray-400 px-6 py-3 rounded-md hover:bg-[#2A462C] hover:text-gray-200 transition-colors"
              >
                Organizations
              </Link>
              <Link 
                to="/create-profile" 
                className="bg-[#1D211A] text-gray-400 px-6 py-3 rounded-md hover:bg-[#2A462C] hover:text-gray-200 transition-colors"
              >
                Submit Project
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleProfileClick}
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700"
            >
              <User className="h-6 w-6" />
            </button>
            <div className="flex flex-col items-end">
              <button
                onClick={() => setIsWalletModalOpen(true)}
                disabled={isConnecting}
                className={`bg-[#B4F481] text-black px-4 py-2 rounded-md hover:bg-[#9FE070] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isConnecting ? 'cursor-wait' : ''
                }`}
              >
                {isConnecting
                  ? 'Connecting...'
                  : account
                  ? `${account.slice(0, 6)}...${account.slice(-4)}`
                  : 'Connect Wallet'}
              </button>
              {account && (
                <span className="text-xs text-[#B4F481] mt-1">Base Testnet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={handleConnectWallet}
      />
    </nav>
  );
};

export default Navbar;