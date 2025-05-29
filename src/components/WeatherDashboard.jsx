import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { getWeatherBackground } from '../utils/formatters';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import WeatherDetails from './WeatherDetails';
import UnitToggle from './UnitToggle';
import LoadingSpinner from './LoadingSpinner';
import { Sun, Cloud, CloudRain } from 'lucide-react';

const WeatherDashboard = () => {
  const { weatherData, loading, error } = useWeather();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !weatherData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-800 to-indigo-900 text-white">
        <div className="text-center">
          <CloudRain size={64} className="mx-auto mb-4 text-blue-300" />
          <h2 className="text-2xl font-semibold mb-2">
            {error || "Couldn't load weather data"}
          </h2>
          <p className="mb-6">Please try searching for a location.</p>
          <SearchBar />
        </div>
      </div>
    );
  }

  const bgClass = getWeatherBackground(
    weatherData.current.condition.code,
    weatherData.current.is_day
  );

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${bgClass}`}
    >
      {/* Header */}
      <header className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-2">
            {weatherData.current.is_day ? (
              <Sun size={32} className="text-yellow-300" />
            ) : (
              <Cloud size={32} className="text-blue-200" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">Weather Report</h1>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-3">
          <SearchBar />
          <UnitToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 pb-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <CurrentWeather />
          <WeatherForecast />
          <WeatherDetails />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-white/80 text-sm">
        <p>
          Data provided by{' '}
          <a
            href="https://www.weatherapi.com/"
            className="underline hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            WeatherAPI.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default WeatherDashboard;