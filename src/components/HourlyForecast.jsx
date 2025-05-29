import React, { useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { formatHour, formatTemperature } from '../utils/formatters';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HourlyForecast = ({ day }) => {
  const { weatherData, unitSystem } = useWeather();
  const scrollRef = useRef(null);

  if (!weatherData) return null;

  const { forecast } = weatherData;
  const hours = forecast.forecastday[day].hour;

  const currentHour = new Date().getHours();
  
  // Filter hours for today to only show future hours
  const filteredHours = day === 0 
    ? hours.filter(hour => {
        const hourTime = new Date(hour.time).getHours();
        return hourTime >= currentHour;
      })
    : hours;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-white">Hourly Forecast</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <Card className="text-white overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex space-x-4 px-2">
            {filteredHours.map((hour, index) => {
              const temp = unitSystem === 'metric' ? hour.temp_c : hour.temp_f;
              const chance = hour.chance_of_rain > hour.chance_of_snow 
                ? `${hour.chance_of_rain}% rain` 
                : hour.chance_of_snow > 0 
                  ? `${hour.chance_of_snow}% snow` 
                  : null;
              
              return (
                <motion.div 
                  key={hour.time}
                  className="flex flex-col items-center min-w-[80px] p-3 rounded-lg hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <p className="text-sm font-medium mb-1">{formatHour(hour.time)}</p>
                  <img 
                    src={`https:${hour.condition.icon}`} 
                    alt={hour.condition.text}
                    className="w-10 h-10 my-1"
                  />
                  <p className="text-lg font-medium">{Math.round(temp)}°</p>
                  {chance && (
                    <p className="text-xs text-blue-300 mt-1">{chance}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HourlyForecast;