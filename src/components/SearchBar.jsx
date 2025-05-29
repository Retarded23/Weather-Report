import React, { useState, useRef, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X } from 'lucide-react';

const SearchBar = () => {
  const { searchLocation, refreshWeather } = useWeather();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchLocation(query.trim());
      setQuery('');
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    refreshWeather();
    setQuery('');
    setIsSearching(false);
  };

  useEffect(() => {
    if (isSearching && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearching]);

  return (
    <div className="relative z-10">
      <AnimatePresence>
        {isSearching ? (
          <motion.form
            initial={{ opacity: 0, width: 40 }}
            animate={{ opacity: 1, width: 280 }}
            exit={{ opacity: 0, width: 40 }}
            transition={{ duration: 0.3 }}
            className="relative"
            onSubmit={handleSearch}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search location..."
              className="w-full pl-10 pr-10 py-2 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
            />
            <button
              type="button"
              onClick={() => setIsSearching(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              <X size={18} />
            </button>
            <div className="absolute top-full left-0 right-0 mt-2">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center gap-2 p-2 rounded-md bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition-colors"
              >
                <MapPin size={16} />
                <span>Use current location</span>
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition-colors"
            onClick={() => setIsSearching(true)}
          >
            <Search size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;