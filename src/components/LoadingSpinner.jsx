import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="mb-4"
      >
        <CloudRain size={48} className="text-blue-300" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-medium text-center"
      >
        Loading weather data...
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-white/70 text-center mt-2"
      >
        Fetching the latest forecast for your location
      </motion.p>
      
      <div className="mt-6 relative w-48 h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-blue-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;