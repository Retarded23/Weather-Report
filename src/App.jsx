import { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, CloudRain, Sun, Search, MapPin, Wind, Droplets, Thermometer } from 'lucide-react';

function App() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add suggestions state
  const suggestions = [
    'London',
    'New York',
    'Tokyo',
    'Paris',
    'Sydney',
    'Mumbai',
    'Toronto',
    'Berlin',
    'Moscow',
    'Beijing'
  ];
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchWeather = async (searchLocation) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${searchLocation}&days=3&aqi=yes`);
      setWeather(response.data);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('London');
  }, []);

  // Filter suggestions as user types
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length > 0) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // When user clicks a suggestion
  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location);
      setLocation('');
      setShowSuggestions(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <Cloud className="animate-bounce mx-auto mb-4" size={48} />
          <p className="text-xl">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <CloudRain className="mx-auto mb-4" size={48} />
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => fetchWeather('London')}
            className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="Search location..."
              className="w-full px-4 py-3 pl-12 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              onFocus={() => location && setShowSuggestions(true)}
              autoComplete="off"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              <MapPin size={20} />
            </button>
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 mt-1 bg-white/90 rounded-lg shadow-lg text-black max-h-48 overflow-y-auto">
                {filteredSuggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>

        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-2xl font-bold text-white mb-2">
                {weather.location.name}, {weather.location.country}
              </h1>
              <p className="text-white/70">
                {new Date(weather.location.localtime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center">
              {weather.current.is_day ? (
                <Sun className="text-yellow-300\" size={48} />
              ) : (
                <Cloud className="text-blue-200" size={48} />
              )}
              <div className="ml-4">
                <p className="text-5xl font-light text-white">
                  {Math.round(weather.current.temp_c)}°C
                </p>
                <p className="text-white/70">Feels like {Math.round(weather.current.feelslike_c)}°C</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weather.forecast.forecastday.map((day) => (
            <div
              key={day.date}
              className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-white"
            >
              <p className="text-lg mb-2">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text}
                    className="w-12 h-12"
                  />
                  <div className="ml-2">
                    <p className="text-2xl">{Math.round(day.day.maxtemp_c)}°C</p>
                    <p className="text-white/70">{Math.round(day.day.mintemp_c)}°C</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/70">{day.day.condition.text}</p>
                  <p className="flex items-center justify-end mt-1">
                    <Droplets size={16} className="mr-1" />
                    {day.day.daily_chance_of_rain}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-white">
            <Wind className="mb-2" size={24} />
            <p className="text-sm text-white/70">Wind Speed</p>
            <p className="text-xl">{weather.current.wind_kph} km/h</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-white">
            <Droplets className="mb-2" size={24} />
            <p className="text-sm text-white/70">Humidity</p>
            <p className="text-xl">{weather.current.humidity}%</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-white">
            <Sun className="mb-2" size={24} />
            <p className="text-sm text-white/70">UV Index</p>
            <p className="text-xl">{weather.current.uv}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-white">
            <Thermometer className="mb-2" size={24} />
            <p className="text-sm text-white/70">Pressure</p>
            <p className="text-xl">{weather.current.pressure_mb} mb</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;