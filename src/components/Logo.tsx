import { motion } from "motion/react";

export const Logo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full drop-shadow-[0_0_25px_rgba(255,0,0,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0000" />
            <stop offset="100%" stopColor="#8b0000" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Main Shield Body */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          d="M50 5 L90 20 V55 C90 85 50 115 50 115 C50 115 10 85 10 55 V20 L50 5Z"
          fill="url(#shieldGradient)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        
        {/* Inner Detail Ring */}
        <path 
          d="M50 12 L82 24 V52 C82 78 50 105 50 105 C50 105 18 78 18 52 V24 L50 12Z" 
          stroke="white" 
          strokeWidth="0.5" 
          opacity="0.1" 
        />

        {/* Sharp Geometric "W" */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          d="M30 45 L40 80 L50 60 L60 80 L70 45"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#glow)"
        />

        {/* Diamond Accents */}
        <motion.rect 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.2 }}
          x="48" y="15" width="4" height="4" fill="white" transform="rotate(45 50 17)" 
        />
        <motion.rect 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.2 }}
          x="48" y="105" width="4" height="4" fill="white" transform="rotate(45 50 107)" 
        />
      </svg>

      {/* Outer Pulse Ring */}
      <motion.div 
        className="absolute -inset-4 border border-red-600/10 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.div>
  );
};
