import React, { useState } from 'react';
import { X, Wallet, AlertCircle } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (wallet: string, manualAddress?: string) => void;
}

const DEFAULT_WALLET = '0x1F9fECf4100f18a227fab7E3868cA89Ef6b9e9F7';

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onSelectWallet }) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState(DEFAULT_WALLET);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect to your MetaMask Wallet'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '📱',
      description: 'Connect to your Coinbase Wallet'
    }
  ];

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddress || !/^0x[a-fA-F0-9]{40}$/.test(manualAddress)) {
      setError('Please enter a valid Ethereum address');
      return;
    }
    onSelectWallet('manual', manualAddress);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-md mx-4 bg-gray-900 rounded-xl shadow-2xl transform transition-all"
        style={{ 
          maxHeight: 'calc(100vh - 8rem)',
          marginTop: 'auto',
          marginBottom: 'auto'
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-[#B4F481]" />
              Connect Wallet
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {!showManualInput ? (
            <>
              <div className="space-y-3 mb-6">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => onSelectWallet(wallet.id)}
                    className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-[#B4F481]/20"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{wallet.icon}</span>
                      <div>
                        <h3 className="text-white font-medium">{wallet.name}</h3>
                        <p className="text-gray-400 text-sm">{wallet.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">or</span>
                </div>
              </div>

              <button
                onClick={() => setShowManualInput(true)}
                className="w-full text-[#B4F481] hover:text-[#9FE070] text-sm"
              >
                Enter wallet address manually
              </button>
            </>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  value={manualAddress}
                  onChange={(e) => {
                    setManualAddress(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#B4F481]"
                  placeholder="0x..."
                />
                {error && (
                  <div className="mt-2 flex items-center text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#B4F481] text-black rounded-lg hover:bg-[#9FE070]"
                >
                  Connect
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            By connecting a wallet, you agree to Regen Bazaar's Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;