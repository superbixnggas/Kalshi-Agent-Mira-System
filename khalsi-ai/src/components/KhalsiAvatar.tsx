import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface KhalsiAvatarProps {
  variant?: 'main' | 'dashboard' | 'trading' | 'mini';
  interactive?: boolean;
  showBubble?: boolean;
  bubbleText?: string;
  className?: string;
}

const KhalsiAvatar: React.FC<KhalsiAvatarProps> = ({
  variant = 'main',
  interactive = false,
  showBubble = false,
  bubbleText = '',
  className = '',
}) => {
  const sizeClasses = {
    main: 'w-48 h-48',
    dashboard: 'w-32 h-32',
    trading: 'w-40 h-40',
    mini: 'w-16 h-16',
  };

  const imageMap = {
    main: '/images/khalsi_waifu_main.png',
    dashboard: '/images/khalsi_dashboard_avatar.png',
    trading: '/images/khalsi_trading_desk.png',
    mini: '/images/khalsi_dashboard_avatar.png',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Khalsi Character Image */}
      <motion.div
        className={cn(
          'relative overflow-hidden rounded-full border-2 border-neon-purple/30 shadow-xl',
          sizeClasses[variant],
          interactive && 'cursor-pointer hover:scale-105 transition-transform duration-300'
        )}
        whileHover={interactive ? { scale: 1.05 } : {}}
        whileTap={interactive ? { scale: 0.95 } : {}}
        animate={!interactive ? { y: [0, -5, 0] } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img
          src={imageMap[variant]}
          alt={`Khalsi AI - ${variant} avatar`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Neon glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-blue/20 via-transparent to-neon-purple/20 pointer-events-none" />
        
        {/* Animated ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-neon-purple/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="absolute -bottom-2 -right-2 w-6 h-6 bg-neon-green rounded-full border-2 border-dark-bg flex items-center justify-center"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </motion.div>

      {/* Speech bubble */}
      {showBubble && bubbleText && (
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-dark-elevated border border-neon-blue rounded-lg px-4 py-2 shadow-lg max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-white font-medium text-center">{bubbleText}</p>
          
          {/* Bubble arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-dark-elevated" />
          
          {/* Bubble glow */}
          <div className="absolute inset-0 rounded-lg bg-neon-blue/10 animate-pulse" />
        </motion.div>
      )}
    </div>
  );
};

export default KhalsiAvatar;