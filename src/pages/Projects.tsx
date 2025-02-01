import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Leaf, Search, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  funding_goal: number;
  current_funding: number;
  start_date: string;
  status: string;
  impact_value: number;
  organization: {
    name: string;
    logo_url: string;
    type: string;
  };
}

const CATEGORIES = [
  'All',
  'CO₂ Emissions Reduction',
  'Air Quality Improvement',
  'Youth Empowerment',
  'Wildlife Conservation',
  'Animal Care',
  'Renewable Energy',
  'Educational Programs',
  'Human Rights Advocacy',
  'Food Programs',
  'Waste Management'
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          organization:organizations(name, logo_url, type)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.organization?.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#B4F481]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-6xl font-bold text-[#B4F481] mb-12">
          BUY IMPACT PRODUCTS
        </h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search impact products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#B4F481]"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-[#B4F481] text-black'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Groups */}
        {['ECOTHAILAND IMPCT PRODUCT 2024', 'CLEAN PHANGAN IMPACT PRODUCT 2024'].map((group) => (
          <div key={group} className="mb-12">
            <h2 className="text-white text-xl font-semibold mb-6">{group}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-900 rounded-lg overflow-hidden relative"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="aspect-square relative">
                    {project.organization?.logo_url ? (
                      <img
                        src={project.organization.logo_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <Leaf className="h-12 w-12 text-[#B4F481]" />
                      </div>
                    )}
                    
                    {/* Hover Actions - Only Buy button */}
                    {hoveredProject === project.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                        <button className="w-32 py-2 bg-[#B4F481] text-black rounded hover:bg-[#9FE070] transition-colors">
                          Buy
                        </button>
                      </div>
                    )}
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
                        <p className="text-[#B4F481]">{project.impact_value || '0.1'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;