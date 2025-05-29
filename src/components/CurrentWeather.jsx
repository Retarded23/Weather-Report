import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { formatTemperature, formatTime, formatDate } from '../utils/formatters';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock } from 'lucide-react';

const CurrentWeather = () => {
  const { weatherData, unitSystem } = useWeather();

  if (!weatherData) return null;

  const { current, location } = weatherData;
  const temp = unitSystem === 'metric' ? current.temp_c : current.temp_f;
  const feelsLike = unitSystem === 'metric' ? current.feelslike_c : current.feelslike_f;

  return (
    <Card className="mb-6 text-white overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center mb-1">
            <MapPin size={16} className="mr-1" />
            <h2 className="text-xl font-semibold">
              {location.name}, {location.country}
            </h2>
          </div>
          <div className="flex items-center text-sm text-white/80 mb-4">
            <Calendar size={14} className="mr-1" />
            <span className="mr-3">{formatDate(location.localtime)}</span>
            <Clock size={14} className="mr-1" />
            <span>{formatTime(location.localtime)}</span>
          </div>

          <div className="flex items-center">
            <motion.img
              src={`https:${current.condition.icon}`}
              alt={current.condition.text}
              className="w-24 h-24"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div>
              <div className="flex items-end">
                <motion.span
                  className="text-6xl font-light"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {Math.round(temp)}
                </motion.span>
                <motion.span
                  className="text-2xl mb-1 ml-1"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {unitSystem === 'metric' ? '°C' : '°F'}
                </motion.span>
              </div>
              <p className="text-white/80">
                Feels like {formatTemperature(feelsLike, unitSystem)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="font-medium mb-2 text-center">{current.condition.text}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/70">Humidity</p>
              <p className="font-medium">{current.humidity}%</p>
            </div>
            <div>
              <p className="text-white/70">Wind</p>
              <p className="font-medium">
                {unitSystem === 'metric' ? `${current.wind_kph} km/h` : `${current.wind_mph} mph`}
              </p>
            </div>
            <div>
              <p className="text-white/70">Pressure</p>
              <p className="font-medium">
                {unitSystem === 'metric' ? `${current.pressure_mb} mb` : `${current.pressure_in} in`}
              </p>
            </div>
            <div>
              <p className="text-white/70">Visibility</p>
              <p className="font-medium">
                {unitSystem === 'metric' ? `${current.vis_km} km` : `${current.vis_miles} mi`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CurrentWeather;