import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, Loader2 } from 'lucide-react';

interface ImpactProduct {
  id: string;
  title: string;
  price: number;
  impact_value: number;
  year: number;
}

interface OrganizationStats {
  ipCollections: number;
  ipSold: number;
  proposalsSubmitted: number;
  qfParticipated: number;
}

const OrganizationProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tokenize' | 'propose'>('dashboard');
  const [products2024, setProducts2024] = useState<ImpactProduct[]>([]);
  const [products2023, setProducts2023] = useState<ImpactProduct[]>([]);
  const [stats, setStats] = useState<OrganizationStats>({
    ipCollections: 10,
    ipSold: 150,
    proposalsSubmitted: 5,
    qfParticipated: 3
  });

  useEffect(() => {
    fetchOrganizationData();
  }, [id]);

  const fetchOrganizationData = async () => {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', id);

      if (error) throw error;

      // Split projects by year
      const products2024Data = [
        {
          id: '1',
          title: 'Community gardens',
          price: 0.0005,
          impact_value: 0.1,
          year: 2024
        },
        {
          id: '2',
          title: 'Tree preservation',
          price: 0.0012,
          impact_value: 0.25,
          year: 2024
        },
        {
          id: '3',
          title: 'Eco tourism',
          price: 0.0025,
          impact_value: 0.5,
          year: 2024
        },
        {
          id: '4',
          title: 'Educational programs',
          price: 0.0043,
          impact_value: 0.85,
          year: 2024
        }
      ];

      const products2023Data = [
        {
          id: '5',
          title: 'Beach cleanup',
          price: 0.0015,
          impact_value: 0.3,
          year: 2023
        },
        {
          id: '6',
          title: 'Coral restoration',
          price: 0.0035,
          impact_value: 0.7,
          year: 2023
        }
      ];

      setProducts2024(products2024Data);
      setProducts2023(products2023Data);
    } catch (error) {
      console.error('Error fetching organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductGrid = (products: ImpactProduct[]) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-black border border-gray-800 rounded-lg overflow-hidden">
          <div className="aspect-square relative bg-gray-900">
            {/* Project image would go here */}
          </div>
          <div className="p-4">
            <h3 className="text-white font-medium mb-4">{product.title}</h3>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500">price</p>
                <p className="text-[#B4F481]">Eth {product.price}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">impact value</p>
                <p className="text-[#B4F481]">{product.impact_value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
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
        {/* Header with tabs */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-6xl font-bold text-[#B4F481]">
            NGO/COMMUNITY PROFILE
          </h1>
          <div className="flex space-x-2">
            {(['dashboard', 'tokenize', 'propose'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab
                    ? 'bg-[#B4F481] text-black'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* Stats Section */}
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">STATS</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">IP COLLECTIONS:</span>
                <span className="text-[#B4F481]">{stats.ipCollections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IP SOLD:</span>
                <span className="text-[#B4F481]">{stats.ipSold}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PROPOSALS SUBMITTED:</span>
                <span className="text-[#B4F481]">{stats.proposalsSubmitted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">QF PARTICIPATED:</span>
                <span className="text-[#B4F481]">{stats.qfParticipated}</span>
              </div>
            </div>
          </div>

          {/* Impact Products Section */}
          <div className="col-span-3 space-y-12">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">IMPACT PRODUCT 2024</h2>
                <Link to="/stats" className="text-gray-400 hover:text-white flex items-center">
                  sale stats <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              {renderProductGrid(products2024)}
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">IMPACT PRODUCT 2023</h2>
                <Link to="/stats" className="text-gray-400 hover:text-white flex items-center">
                  sale stats <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              {renderProductGrid(products2023)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;