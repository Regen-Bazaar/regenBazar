import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OrganizationProfile from './pages/OrganizationProfile';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import CreateNonProfitProfile from './pages/CreateNonProfitProfile';
import Projects from './pages/Projects';
import Organizations from './pages/Organizations';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/organization/:id" element={<OrganizationProfile />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/create-profile" element={<CreateNonProfitProfile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;