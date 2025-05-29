import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const Card = ({
  children,
  className,
  onClick,
  animate = true
}) => {
  const baseClasses = "rounded-2xl backdrop-blur-md bg-white/10 p-4 shadow-lg border border-white/10";
  
  if (!animate) {
    return (
      <div 
        className={clsx(baseClasses, className)}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      className={clsx(baseClasses, className, onClick && "cursor-pointer")}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};