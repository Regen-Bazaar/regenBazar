import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface ProjectsByWallet {
  [key: string]: Project[];
}

const Organizations = () => {
  const [loading, setLoading] = useState(true);
  const [projectsByWallet, setProjectsByWallet] = useState<ProjectsByWallet>({});
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts[0]) {
            setWalletAddress(accounts[0]);
            await fetchProjects();
          }
        } catch (error) {
          console.error('Error checking wallet:', error);
        }
      }
    };

    checkWallet();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          *,
          organization:organizations(name, logo_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group projects by wallet address
      const grouped = (projects || []).reduce((acc: ProjectsByWallet, project) => {
        if (!acc[project.wallet_address]) {
          acc[project.wallet_address] = [];
        }
        acc[project.wallet_address].push(project);
        return acc;
      }, {});

      setProjectsByWallet(grouped);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#B4F481]">Organizations</h1>
          {walletAddress && (
            <Link
              to="/create-project"
              className="bg-[#B4F481] text-black px-6 py-3 rounded-md hover:bg-[#9FE070] transition-colors"
            >
              Create New Project
            </Link>
          )}
        </div>

        {Object.entries(projectsByWallet).map(([address, projects]) => (
          <div key={address} className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-6">
              Organization ({address.slice(0, 6)}...{address.slice(-4)})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="aspect-square relative bg-gray-800">
                    {project.organization?.logo_url && (
                      <img
                        src={project.organization.logo_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Funding Goal</p>
                        <p className="text-[#B4F481]">{project.funding_goal} ETH</p>
                      </div>
                      <Link
                        to={`/project/${project.id}`}
                        className="flex items-center text-[#B4F481] hover:text-[#9FE070]"
                      >
                        View Details
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(projectsByWallet).length === 0 && (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg">
            <p className="text-gray-400">No organizations found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;