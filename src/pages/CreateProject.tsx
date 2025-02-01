import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const CreateProject = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
  });

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts[0]) {
            setWalletAddress(accounts[0]);
          } else {
            toast.error('Please connect your wallet to create a project');
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking wallet:', error);
          navigate('/');
        }
      } else {
        toast.error('Please install a Web3 wallet to create a project');
        navigate('/');
      }
    };

    checkWallet();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      toast.error('Please connect your wallet to create a project');
      return;
    }

    try {
      // First, get or create organization for this wallet
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single();

      let organizationId;

      if (orgError) {
        // Create new organization if none exists
        const { data: newOrg, error: createOrgError } = await supabase
          .from('organizations')
          .insert({
            name: `Organization ${walletAddress.slice(0, 6)}`,
            wallet_address: walletAddress,
            type: 'Individual'
          })
          .select('id')
          .single();

        if (createOrgError) throw createOrgError;
        organizationId = newOrg.id;
      } else {
        organizationId = orgData.id;
      }

      // Create the project
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          title: formData.title,
          description: formData.description,
          funding_goal: parseFloat(formData.fundingGoal),
          organization_id: organizationId,
          wallet_address: walletAddress,
          start_date: new Date().toISOString(),
          status: 'active',
          category: 'Environmental'
        });

      if (projectError) throw projectError;

      toast.success('Project created successfully!');
      navigate('/organizations');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-[#B4F481] mb-8">Create New Project</h1>
      <div className="bg-gray-800 rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              placeholder="Enter project title"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              placeholder="Describe your project"
              required
            />
          </div>
          <div>
            <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-300">
              Funding Goal (ETH)
            </label>
            <input
              type="number"
              id="fundingGoal"
              value={formData.fundingGoal}
              onChange={handleInputChange}
              step="0.001"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#B4F481] text-black px-4 py-2 rounded-md hover:bg-[#9FE070]"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;