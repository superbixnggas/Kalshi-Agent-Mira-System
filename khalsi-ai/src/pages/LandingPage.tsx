import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon, ChartBarIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import KhalsiAvatar from '@/components/KhalsiAvatar';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <ChartBarIcon className="h-8 w-8 text-neon-blue" />,
      title: 'Probabilitas yang Jelas dan Transparan',
      description: 'Khalsi menjelaskan apa arti probabilitas untuk keputusan Anda hari ini, dengan asumsi dan timeframe yang eksplisit.',
      gradient: 'from-neon-blue/20 to-neon-blue/5',
    },
    {
      icon: <SparklesIcon className="h-8 w-8 text-neon-purple" />,
      title: 'Pahami Arah Pergerakan',
      description: 'Identifikasi perubahan tren lebih awal dan dapatkan konteks tentang apakah itu sinyal atau noise.',
      gradient: 'from-neon-purple/20 to-neon-purple/5',
    },
    {
      icon: <CpuChipIcon className="h-8 w-8 text-neon-green" />,
      title: 'Saran Langkah Kecil yang Praktis',
      description: 'Setiap analisis menutup dengan tindakan yang dapat diambil dalam 24–48 jam ke depan.',
      gradient: 'from-neon-green/20 to-neon-green/5',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 anime-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent)]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-sm font-medium mb-6"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                AI-Powered Solana Analytics
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="neon-glow-text text-neon-blue">Khalsi AI:</span>
                <br />
                <span className="text-white">Memahami Peluang</span>
                <br />
                <span className="text-neon-purple">Pasar dengan Lebih Jelas</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Khalsi membantu Anda menafsirkan probabilitas dan tren dengan cara yang sederhana, 
                sehingga keputusan berikutnya terasa lebih yakin.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/dashboard">
                  <Button size="lg" glow className="w-full sm:w-auto">
                    Jelajahi Dashboard
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/market-probability">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    Pelajari Market Probability
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-neon-green rounded-full mr-2 animate-pulse" />
                  Real-time Data
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mr-2 animate-pulse" />
                  AI-Powered Insights
                </div>
              </div>
            </motion.div>

            {/* Right Content - Khalsi Avatar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <KhalsiAvatar
                variant="main"
                interactive
                showBubble
                bubbleText="Halo! Saya Khalsi. Yuk mulai memahami peluang pasar Solana bersama!"
                className="animate-float"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Khalsi AI Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Kenapa Memilih <span className="text-neon-purple">Khalsi AI</span>?
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Platform AI yang dirancang khusus untuk analisis pasar Solana dengan pendekatan yang jelas dan transparan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="glass" className={`h-full bg-gradient-to-br ${feature.gradient} border-0 hover:border-neon-blue/30 transition-all duration-300`}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Snapshot Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-surface/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fitur <span className="text-neon-blue">Unggulan</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Khalsi AI menyediakan инструментия canggih untuk analisis pasar Solana yang mudah dipahami.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Market Probability */}
            <Card variant="elevated" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-neon-green text-dark-bg text-sm font-bold">
                AKTIF
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-neon-blue">Market Probability</CardTitle>
                <CardDescription>
                  Prediksi real-time dengan visualisasi interaktif dan confidence level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Solana (SOL) Price</span>
                    <span className="text-neon-green">$185.43</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>60min Probability</span>
                    <span className="text-neon-blue">62% ↑</span>
                  </div>
                  <Link to="/market-probability">
                    <Button size="sm" className="w-full mt-4">
                      Coba Sekarang
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Interactive AI Mode */}
            <Card variant="glass" className="relative">
              <div className="absolute top-0 right-0 px-3 py-1 bg-neon-purple text-white text-sm font-bold">
                COMING SOON
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-neon-purple">Interactive AI Mode</CardTitle>
                <CardDescription>
                  Chat langsung dengan Khalsi AI untuk analisis mendalam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-400">
                  <p>• Percakapan real-time</p>
                  <p>• Analisis mendalam</p>
                  <p>• Konteks pasar terintegrasi</p>
                  <Button size="sm" variant="ghost" className="w-full mt-4" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Explore Insights */}
            <Card variant="glass" className="relative">
              <div className="absolute top-0 right-0 px-3 py-1 bg-neon-purple text-white text-sm font-bold">
                COMING SOON
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-neon-purple">Explore Insights</CardTitle>
                <CardDescription>
                  Dashboard analitik untuk trending tokens dan insights mendalam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-400">
                  <p>• Trending tokens Solana</p>
                  <p>• Market sentiment analysis</p>
                  <p>• Historical insights</p>
                  <Button size="sm" variant="ghost" className="w-full mt-4" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Community Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Memulai Perjalanan <span className="text-neon-green">Solana</span>?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan komunitas trader dan investor yang menggunakan AI untuk memahami pasar dengan lebih baik.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" glow>
                  Mulai Gratis
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="lg">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;