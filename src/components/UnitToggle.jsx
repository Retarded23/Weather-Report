import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { motion } from 'framer-motion';

const UnitToggle = () => {
  const { unitSystem, toggleUnitSystem } = useWeather();

  return (
    <motion.div 
      className="relative w-20 h-10 bg-white/20 backdrop-blur-md rounded-full p-1 cursor-pointer border border-white/20"
      onClick={toggleUnitSystem}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex h-full">
        <span className={`flex-1 flex items-center justify-center text-sm ${unitSystem === 'metric' ? 'text-white' : 'text-white/60'}`}>
          °C
        </span>
        <span className={`flex-1 flex items-center justify-center text-sm ${unitSystem === 'imperial' ? 'text-white' : 'text-white/60'}`}>
          °F
        </span>
      </div>
      <motion.div 
        className="absolute top-1 w-9 h-8 bg-white/30 rounded-full"
        initial={false}
        animate={{ 
          left: unitSystem === 'metric' ? '1px' : 'calc(100% - 9px - 28px)'
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.div>
  );
};

export default UnitToggle;