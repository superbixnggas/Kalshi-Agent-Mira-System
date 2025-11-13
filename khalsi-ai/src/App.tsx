import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import MarketProbabilityPage from '@/pages/MarketProbabilityPage';
import ComingSoonPage from '@/pages/ComingSoonPage';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-dark-bg">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/market-probability" element={<MarketProbabilityPage />} />
            <Route path="/interactive-ai" element={<ComingSoonPage />} />
            <Route path="/explore-insights" element={<ComingSoonPage />} />
            {/* Catch all route - redirect to landing page */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;