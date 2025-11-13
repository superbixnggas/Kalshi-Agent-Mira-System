import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import KhalsiAvatar from './KhalsiAvatar';
import Button from './ui/Button';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Beranda', description: 'Khalsi AI - Platform Analisis Solana' },
    { path: '/dashboard', label: 'Dashboard', description: 'Market overview & analytics' },
    { path: '/market-probability', label: 'Market Probability', description: 'Real-time predictions' },
    { path: '/interactive-ai', label: 'Interactive AI', description: 'Chat dengan Khalsi (Coming Soon)' },
    { path: '/explore-insights', label: 'Explore Insights', description: 'Market insights (Coming Soon)' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-dark-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Khalsi Avatar */}
          <Link to="/" className="flex items-center space-x-3">
            <KhalsiAvatar variant="mini" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white neon-glow-text">Khalsi AI</h1>
              <p className="text-xs text-gray-400">Solana Market Intelligence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-neon-blue neon-glow-text'
                      : 'text-gray-300 hover:text-neon-purple'
                  }`}
                >
                  {item.label}
                  {item.path.includes('coming-soon') && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-neon-green text-dark-bg rounded">
                      Soon
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-blue"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Masuk
            </Button>
            <Button variant="primary" size="sm" glow>
              Coba Sekarang
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-surface border-t border-dark-elevated">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive(item.path)
                  ? 'text-neon-blue bg-dark-elevated'
                  : 'text-gray-300 hover:text-neon-purple hover:bg-dark-elevated/50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                {item.path.includes('coming-soon') && (
                  <span className="px-2 py-1 text-xs bg-neon-green text-dark-bg rounded">
                    Soon
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
            </Link>
          ))}
          
          {/* Mobile CTA */}
          <div className="pt-4 space-y-2">
            <Button variant="ghost" size="sm" className="w-full">
              Masuk
            </Button>
            <Button variant="primary" size="sm" glow className="w-full">
              Coba Sekarang
            </Button>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navigation;