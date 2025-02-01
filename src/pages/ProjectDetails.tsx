import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  funding_goal: number;
  current_funding: number;
  organization: {
    name: string;
    logo_url: string;
  };
}

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            organization:organizations(name, logo_url)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#B4F481] animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-400">Project not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-[#B4F481] mb-4">{project.title}</h1>
          <div className="flex items-center mb-6">
            <img
              src={project.organization.logo_url}
              alt={project.organization.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="text-white">{project.organization.name}</p>
              <p className="text-gray-400">Project Creator</p>
            </div>
          </div>
          <p className="text-gray-300 mb-8">{project.description}</p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-gray-400">Funding Goal</p>
              <p className="text-2xl font-bold text-[#B4F481]">{project.funding_goal} ETH</p>
            </div>
            <div>
              <p className="text-gray-400">Current Funding</p>
              <p className="text-2xl font-bold text-[#B4F481]">{project.current_funding} ETH</p>
            </div>
          </div>
          <button className="mt-8 w-full bg-[#B4F481] text-black px-4 py-3 rounded-md hover:bg-[#9FE070]">
            Buy Impact Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;