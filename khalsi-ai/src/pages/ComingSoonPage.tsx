import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  LightBulbIcon, 
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import KhalsiAvatar from '@/components/KhalsiAvatar';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const ComingSoonPage: React.FC = () => {
  const features = [
    {
      title: 'Interactive AI Mode',
      description: 'Chat langsung dengan Khalsi AI untuk analisis mendalam dan personal',
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-neon-blue" />,
      color: 'from-neon-blue/20 to-neon-blue/5',
      progress: 75,
      features: [
        'Percakapan real-time dengan Khalsi',
        'Analisis mendalam berdasarkan data terbaru',
        'Konteks pasar terintegrasi dalam chat',
        'Saran tindakan yang personal',
      ],
      path: '/interactive-ai',
    },
    {
      title: 'Explore Insights', 
      description: 'Dashboard analitik untuk trending tokens dan insights mendalam',
      icon: <LightBulbIcon className="h-8 w-8 text-neon-purple" />,
      color: 'from-neon-purple/20 to-neon-purple/5',
      progress: 60,
      features: [
        'Trending tokens Solana real-time',
        'Market sentiment analysis',
        'Historical insights dan patterns',
        'Risk assessment mendalam',
      ],
      path: '/explore-insights',
    },
  ];

  const roadmap = [
    {
      phase: 'Fase 1 - MVP',
      features: ['Chat interface dasar', 'Data SOL integration', 'Khalsi personality'],
      timeline: 'Q1 2025',
      status: 'in-progress',
    },
    {
      phase: 'Fase 2 - Enhanced AI',
      features: ['Natural language processing', 'Context awareness', 'Personalization'],
      timeline: 'Q2 2025',
      status: 'planned',
    },
    {
      phase: 'Fase 3 - Full Suite',
      features: ['Complete dashboard', 'Advanced analytics', 'Multi-token support'],
      timeline: 'Q3 2025',
      status: 'planned',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <KhalsiAvatar 
              variant="main" 
              interactive
              showBubble 
              bubbleText="Fitur-fitur canggih sedang saya kembangkan! Tunggu ya~"
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Fitur <span className="text-neon-purple">Coming Soon</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
          >
            Khalsi AI sedang mengembangkan fitur-fitur canggih untuk memberikan pengalaman analisis 
            pasar yang lebih mendalam dan personal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center justify-center space-x-2 text-neon-green"
          >
            <SparklesIcon className="h-5 w-5 animate-pulse" />
            <span className="font-medium">Development in Progress</span>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className={`h-full bg-gradient-to-br ${feature.color} hover:border-neon-blue/30 transition-all duration-300 group cursor-pointer`}>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    {feature.icon}
                    <div>
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-neon-blue font-medium">{feature.progress}%</span>
                    </div>
                    <div className="w-full bg-dark-surface rounded-full h-2">
                      <motion.div
                        className="h-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${feature.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Features List */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-white mb-3">Yang Akan Hadir:</h4>
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center text-gray-300">
                            <div className="w-1.5 h-1.5 bg-neon-blue rounded-full mr-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Coming Soon Badge */}
                    <div className="flex items-center justify-between pt-4 border-t border-dark-elevated">
                      <div className="flex items-center space-x-2 text-neon-purple">
                        <ClockIcon className="h-4 w-4" />
                        <span className="font-medium">Coming Soon</span>
                      </div>
                      
                      <div className="flex items-center text-gray-400 text-sm">
                        <span>Learn more</span>
                        <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Development Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Development Roadmap</CardTitle>
              <CardDescription className="text-center">
                Timeline pengembangan fitur-fitur Khalsi AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {roadmap.map((phase, index) => (
                  <div key={phase.phase} className="relative">
                    {/* Phase Number */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center text-dark-bg font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    <div className="p-4 rounded-lg border border-dark-elevated hover:border-neon-blue/30 transition-colors">
                      <div className="mb-4">
                        <h3 className="font-semibold text-white text-lg">{phase.phase}</h3>
                        <p className="text-neon-blue text-sm">{phase.timeline}</p>
                        <div className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                          phase.status === 'in-progress' 
                            ? 'bg-neon-green/20 text-neon-green' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {phase.status === 'in-progress' ? 'In Progress' : 'Planned'}
                        </div>
                      </div>
                      
                      <ul className="space-y-1">
                        {phase.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-gray-300 text-sm">
                            <div className="w-1 h-1 bg-neon-purple rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Connection Line */}
                    {index < roadmap.length - 1 && (
                      <div className="hidden md:block absolute top-0 right-0 transform translate-x-4 w-8 h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card variant="elevated" className="max-w-2xl mx-auto">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ingin Tahu Lebih Lanjut?
              </h2>
              <p className="text-gray-400 mb-6">
                Dapatkan update terbaru tentang pengembangan fitur-fitur Khalsi AI dan 
                menjadi yang pertama mencoba saat tersedia.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/market-probability">
                  <Button variant="primary" size="lg" glow>
                    Coba Market Probability
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" size="lg">
                    Lihat Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoonPage;