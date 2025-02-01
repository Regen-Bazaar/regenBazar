import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Plus } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  funding_goal: number;
  current_funding: number;
  impact_value: number;
  wallet_address: string;
  organization: {
    name: string;
    logo_url: string;
  };
}

type TabType = 'dashboard' | 'stake' | 'resell';

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [purchasedProjects, setPurchasedProjects] = useState<Project[]>([]);
  const [stakedProjects, setStakedProjects] = useState<Project[]>([]);
  const [createdProjects, setCreatedProjects] = useState<Project[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Dummy stats for now
  const stats = {
    rwiRank: 70,
    votingPower: 170,
    stakedIp: 5,
    apyStakedIp: '20%',
    stakedRebaz: 20000,
    apyStakedTokens: '5%',
    rebazBalance: 150
  };

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts[0]) {
            setWalletAddress(accounts[0]);
            await fetchUserProjects(accounts[0]);
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking wallet:', error);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    checkWallet();
  }, [navigate]);

  const fetchUserProjects = async (address: string) => {
    try {
      // Fetch projects created by the user
      const { data: createdData, error: createdError } = await supabase
        .from('projects')
        .select(`
          *,
          organization:organizations(name, logo_url)
        `)
        .eq('wallet_address', address);

      if (createdError) throw createdError;
      setCreatedProjects(createdData || []);

      // Fetch purchased projects
      const { data: purchasedData, error: purchasedError } = await supabase
        .from('donations')
        .select(`
          project:projects(
            id, title, description, funding_goal, current_funding, wallet_address,
            organization:organizations(name, logo_url)
          )
        `)
        .eq('donor_address', address);

      if (purchasedError) throw purchasedError;
      setPurchasedProjects(purchasedData?.map(d => d.project) || []);

      // For demo purposes, let's assume some projects are staked
      // In a real app, you'd fetch this from a staking contract
      setStakedProjects(purchasedData?.map(d => d.project).slice(0, 2) || []);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProjectGrid = (projects: Project[], emptyMessage: string) => (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${projects.length === 0 ? 'opacity-50' : ''}`}>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="aspect-square relative">
              {project.organization?.logo_url ? (
                <img
                  src={project.organization.logo_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800" />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
                {activeTab === 'dashboard' && (
                  <>
                    <button className="px-4 py-2 bg-[#B4F481] text-black rounded hover:bg-[#9FE070] transition-colors">
                      Stake
                    </button>
                    <button className="px-4 py-2 bg-[#B4F481] text-black rounded hover:bg-[#9FE070] transition-colors">
                      Resell
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-medium mb-2">{project.title}</h3>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-500">price</p>
                  <p className="text-[#B4F481]">Eth {project.funding_goal}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">impact value</p>
                  <p className="text-[#B4F481]">{project.impact_value || 0.1}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-3 text-center py-12 bg-gray-900/50 rounded-lg">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
      <div className="bg-gray-900/50 rounded-lg aspect-square flex items-center justify-center">
        <Plus className="h-12 w-12 text-[#B4F481] opacity-50" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#B4F481] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-6xl font-bold text-[#B4F481]">
            USER PROFILE
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right mr-8">
              <p className="text-gray-500">vo$REBAZ</p>
              <p className="text-[#B4F481] text-xl">{stats.rebazBalance}</p>
            </div>
            <div className="flex space-x-2">
              {(['dashboard', 'stake', 'resell'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-[#B4F481] text-black'
                      : 'bg-[#1D211A] text-gray-400 hover:bg-[#2A462C] hover:text-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">STATS</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">RWI RANK:</span>
                <span className="text-[#B4F481]">{stats.rwiRank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">VOTING POWER, voREBAZ:</span>
                <span className="text-[#B4F481]">{stats.votingPower}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">STAKED IP:</span>
                <span className="text-[#B4F481]">{stats.stakedIp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">APY FOR STAKED IP:</span>
                <span className="text-[#B4F481]">{stats.apyStakedIp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">STAKED $REBAZ:</span>
                <span className="text-[#B4F481]">{stats.stakedRebaz}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">APY FOR STAKED TOKENS:</span>
                <span className="text-[#B4F481]">{stats.apyStakedTokens}</span>
              </div>
            </div>
          </div>

          <div className="col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-12">
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">CREATED PROJECTS</h2>
                  {renderProjectGrid(createdProjects, 'No created projects yet')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">PURCHASED IMPACT PRODUCTS</h2>
                  {renderProjectGrid(purchasedProjects, 'No purchased projects yet')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">STAKED PRODUCTS</h2>
                  {renderProjectGrid(stakedProjects, 'No staked projects yet')}
                </div>
              </div>
            )}
            {activeTab === 'stake' && (
              <div className="bg-gray-900/50 rounded-lg p-8">
                <h2 className="text-xl font-bold text-white mb-6">Stake Your Impact Products</h2>
                {renderProjectGrid(purchasedProjects.filter(p => !stakedProjects.find(s => s.id === p.id)), 'No projects available for staking')}
              </div>
            )}
            {activeTab === 'resell' && (
              <div className="bg-gray-900/50 rounded-lg p-8">
                <h2 className="text-xl font-bold text-white mb-6">Resell Your Impact Products</h2>
                {renderProjectGrid(purchasedProjects, 'No projects available for resale')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;