import React from "react";
import { motion } from "motion/react";
import { Logo } from "./Logo";

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1],
          opacity: 1 
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative"
      >
        <Logo className="w-32 h-32" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-red-600/20 rounded-full blur-3xl -z-10"
        />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
          WHSBC BANK
        </h1>
        <p className="mt-2 text-zinc-400 font-medium tracking-widest text-xs uppercase">
          Private Wealth Management
        </p>
      </motion.div>
    </motion.div>
  );
};
