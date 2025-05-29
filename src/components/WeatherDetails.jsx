import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { 
  formatTime, 
  getUVIndexLabel, 
  getUVIndexColor,
  formatWindSpeed,
  formatPressure,
  formatVisibility
} from '../utils/formatters';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Wind, 
  Gauge, 
  Eye, 
  Sun, 
  Sunrise, 
  Sunset,
  CloudRain,
  Thermometer
} from 'lucide-react';

const WeatherDetails = () => {
  const { weatherData, unitSystem } = useWeather();

  if (!weatherData) return null;

  const { current, forecast } = weatherData;
  const today = forecast.forecastday[0];
  
  const detailItems = [
    {
      title: 'Humidity',
      value: `${current.humidity}%`,
      icon: <Droplets size={24} className="text-blue-300" />,
      description: 'Amount of water vapor in the air'
    },
    {
      title: 'Wind',
      value: formatWindSpeed(unitSystem === 'metric' ? current.wind_kph : current.wind_mph, unitSystem),
      icon: <Wind size={24} className="text-blue-200" />,
      description: `Wind direction: ${current.wind_dir}`
    },
    {
      title: 'Pressure',
      value: formatPressure(unitSystem === 'metric' ? current.pressure_mb : current.pressure_in, unitSystem),
      icon: <Gauge size={24} className="text-green-300" />,
      description: 'Atmospheric pressure'
    },
    {
      title: 'Visibility',
      value: formatVisibility(unitSystem === 'metric' ? current.vis_km : current.vis_miles, unitSystem),
      icon: <Eye size={24} className="text-purple-300" />,
      description: 'Distance you can see clearly'
    },
    {
      title: 'UV Index',
      value: getUVIndexLabel(current.uv),
      icon: <Sun size={24} className="text-yellow-300" />,
      description: `UV Index: ${current.uv}`,
      valueClass: getUVIndexColor(current.uv)
    },
    {
      title: 'Precipitation',
      value: unitSystem === 'metric' ? `${current.precip_mm} mm` : `${current.precip_in} in`,
      icon: <CloudRain size={24} className="text-blue-400" />,
      description: 'Amount of rainfall'
    },
    {
      title: 'Feels Like',
      value: unitSystem === 'metric' ? `${Math.round(current.feelslike_c)}°C` : `${Math.round(current.feelslike_f)}°F`,
      icon: <Thermometer size={24} className="text-red-300" />,
      description: 'How the temperature actually feels'
    }
  ];

  // Add air quality if available
  if (current.air_quality && current.air_quality.pm2_5) {
    const aqiValue = Math.round(current.air_quality.pm2_5);
    let aqiLabel = 'Good';
    let aqiColor = 'text-green-500';
    
    if (aqiValue > 150) {
      aqiLabel = 'Very Unhealthy';
      aqiColor = 'text-red-500';
    } else if (aqiValue > 100) {
      aqiLabel = 'Unhealthy';
      aqiColor = 'text-orange-500';
    } else if (aqiValue > 50) {
      aqiLabel = 'Moderate';
      aqiColor = 'text-yellow-500';
    }
    
    detailItems.push({
      title: 'Air Quality',
      value: aqiLabel,
      valueClass: aqiColor,
      icon: <Wind size={24} className="text-teal-300" />,
      description: `PM2.5: ${aqiValue} μg/m³`
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Weather Details</h2>
      
      {/* Sunrise/Sunset Card */}
      <Card className="text-white">
        <h3 className="text-lg font-medium mb-4">Sunrise & Sunset</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-3 bg-yellow-500/20 p-3 rounded-full">
              <Sunrise size={24} className="text-yellow-300" />
            </div>
            <div>
              <p className="text-sm text-white/70">Sunrise</p>
              <p className="text-xl font-light">{today.astro.sunrise}</p>
            </div>
          </div>
          
          {/* Sun position indicator */}
          <div className="hidden md:block flex-1 mx-6 h-0.5 bg-gradient-to-r from-yellow-500/50 via-yellow-300 to-orange-500/50 rounded-full relative">
            <motion.div 
              className="absolute w-3 h-3 bg-yellow-300 rounded-full -mt-1 shadow-lg shadow-yellow-300/50"
              initial={{ left: 0 }}
              animate={{ left: getSunPosition(today.astro.sunrise, today.astro.sunset) }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          
          <div className="flex items-center">
            <div className="mr-3 bg-orange-500/20 p-3 rounded-full">
              <Sunset size={24} className="text-orange-300" />
            </div>
            <div>
              <p className="text-sm text-white/70">Sunset</p>
              <p className="text-xl font-light">{today.astro.sunset}</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Weather Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {detailItems.map((item, index) => (
          <Card 
            key={item.title} 
            className="text-white"
            animate={true}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-start">
                <div className="mr-3">{item.icon}</div>
                <div>
                  <h3 className="text-white/70 text-sm">{item.title}</h3>
                  <p className={`text-xl font-medium ${item.valueClass || ''}`}>{item.value}</p>
                  <p className="text-xs text-white/60 mt-1">{item.description}</p>
                </div>
              </div>
            </motion.div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function to calculate sun position percentage based on sunrise and sunset times
function getSunPosition(sunrise, sunset) {
  const now = new Date();
  const sunriseTime = parseTimeString(sunrise);
  const sunsetTime = parseTimeString(sunset);
  
  const sunriseDate = new Date(now);
  sunriseDate.setHours(sunriseTime.hours);
  sunriseDate.setMinutes(sunriseTime.minutes);
  
  const sunsetDate = new Date(now);
  sunsetDate.setHours(sunsetTime.hours);
  sunsetDate.setMinutes(sunsetTime.minutes);
  
  // If current time is before sunrise or after sunset
  if (now < sunriseDate || now > sunsetDate) {
    return now > sunsetDate ? '100%' : '0%';
  }
  
  // Calculate percentage
  const totalDayTime = sunsetDate.getTime() - sunriseDate.getTime();
  const elapsedTime = now.getTime() - sunriseDate.getTime();
  const percentage = (elapsedTime / totalDayTime) * 100;
  
  return `${Math.min(100, Math.max(0, percentage))}%`;
}

function parseTimeString(timeString) {
  // Handle "HH:MM AM/PM" format
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return { hours, minutes };
}

export default WeatherDetails;