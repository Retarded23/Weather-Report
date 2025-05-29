import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWeatherData, fetchLocationByCoordinates } from '../services/api';

const WeatherContext = createContext(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unitSystem, setUnitSystem] = useState('metric');
  const [currentLocation, setCurrentLocation] = useState('');

  const searchLocation = async (location) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentLocation(location);
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnitSystem = () => {
    setUnitSystem(prevSystem => (prevSystem === 'metric' ? 'imperial' : 'metric'));
  };

  const refreshWeather = async () => {
    if (currentLocation) {
      await searchLocation(currentLocation);
    } else {
      getUserLocation();
    }
  };

  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await fetchLocationByCoordinates(latitude, longitude);
            setWeatherData(data);
            setCurrentLocation(`${data.location.name}, ${data.location.country}`);
            setError(null);
          } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
            console.error(err);
            await searchLocation('London');
          } finally {
            setLoading(false);
          }
        },
        async error => {
          console.error('Geolocation error:', error);
          setError('Location access denied. Using default location.');
          await searchLocation('London');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Using default location.');
      searchLocation('London');
    }
  };

  useEffect(() => {
    getUserLocation();
    // eslint-disable-next-line
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        searchLocation,
        unitSystem,
        toggleUnitSystem,
        refreshWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};