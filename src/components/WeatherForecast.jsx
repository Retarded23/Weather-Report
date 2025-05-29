import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { formatDay, formatTemperature } from '../utils/formatters';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import HourlyForecast from './HourlyForecast';

const WeatherForecast = () => {
  const { weatherData, unitSystem } = useWeather();
  const [selectedDay, setSelectedDay] = useState(0);

  if (!weatherData) return null;

  const { forecast } = weatherData;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-white">5-Day Forecast</h2>
      <Card className="text-white mb-4">
        <div className="grid grid-cols-5 gap-2">
          {forecast.forecastday.map((day, index) => {
            const isSelected = index === selectedDay;
            const maxTemp = unitSystem === 'metric' ? day.day.maxtemp_c : day.day.maxtemp_f;
            const minTemp = unitSystem === 'metric' ? day.day.mintemp_c : day.day.mintemp_f;

            return (
              <motion.div
                key={day.date}
                className={`relative p-3 rounded-lg text-center cursor-pointer transition-all ${
                  isSelected ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => setSelectedDay(index)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="font-medium mb-1">{index === 0 ? 'Today' : formatDay(day.date)}</p>
                <img
                  src={`https:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                  className="w-12 h-12 mx-auto my-1"
                />
                <div className="flex justify-between text-sm px-1">
                  <span>{Math.round(maxTemp)}°</span>
                  <span className="text-white/70">{Math.round(minTemp)}°</span>
                </div>
                {isSelected && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                    layoutId="dayIndicator"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>

      <HourlyForecast day={selectedDay} />
    </div>
  );
};

export default WeatherForecast;