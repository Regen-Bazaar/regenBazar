import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Twitter, Github, MessageCircle, Send, Mail, Leaf } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="h-16 w-16 text-[#B4F481]" />
          </div>
          <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-[#B4F481] to-green-300 bg-clip-text text-transparent">
            TOKENIZE REAL-WORLD IMPACT
          </h1>
          <h2 className="text-3xl font-light text-gray-400 mb-12 italic">
            EMPOWERING NGOS AND COMMUNITIES
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Convert environmental and social impact into tradeable digital assets. Stake for rewards and participate in ecosystem governance.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/create-profile"
              className="bg-[#B4F481] text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#9FE070] transition-colors"
            >
              APPLY TO TOKENIZE
            </Link>
            <a
              href="https://github.com/Regen-Bazaar/Litepaper"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-700 transition-colors flex items-center"
            >
              <FileText className="mr-2" />
              LITEPAPER
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-[#B4F481] mb-4">Tokenize Impact</h3>
            <p className="text-gray-300">
              Transform your environmental and social initiatives into verifiable digital assets backed by real-world impact data.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-[#B4F481] mb-4">Earn Rewards</h3>
            <p className="text-gray-300">
              Stake your impact tokens to earn $REBAZ rewards and gain voting power in ecosystem governance.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-[#B4F481] mb-4">Drive Change</h3>
            <p className="text-gray-300">
              Join a community of impact creators and supporters building the future of regenerative finance.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-24">
          <Link
            to="/projects"
            className="inline-flex items-center text-[#B4F481] text-xl hover:text-[#9FE070]"
          >
            Explore Impact Projects <ArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-[#B4F481] mb-8 md:mb-0">
              Regen Bazaar
            </div>
            <div className="flex space-x-6">
              <a
                href="https://x.com/RegenBazaar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#B4F481]"
                title="Twitter/X"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/orgs/EcoSynthesisX"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#B4F481]"
                title="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://discord.gg/9WD9e7q2eD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#B4F481]"
                title="Discord"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
              <a
                href="https://t.me/EcoSynthesisX"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#B4F481]"
                title="Telegram"
              >
                <Send className="h-6 w-6" />
              </a>
              <a
                href="mailto:Ecosynthesisx@skiff.com"
                className="text-gray-400 hover:text-[#B4F481]"
                title="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;