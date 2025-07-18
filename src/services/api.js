import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

 

export const fetchWeatherData = async (location, days = 5) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: location,
        days,
        aqi: 'yes',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchLocationByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        days: 5,
        aqi: 'yes',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
};

export const fetchWaterQualityData = async () => {
  // Replace this with your real API logic later
  return {
    lastUpdated: new Date().toISOString(),
    measurements: [
      { label: "PH", value: "7.8", unit: "", status: "Within safe limits" },
      { label: "TDS", value: "480", unit: "mg/L", status: "Within safe limits" },
      { label: "HARDNESS", value: "320", unit: "mg/L", status: "Exceeds safe limits", error: true },
      { label: "CHLORINE", value: "3.2", unit: "mg/L", status: "Within safe limits" },
      { label: "TURBIDITY", value: "4.5", unit: "NTU", status: "Within safe limits" },
      { label: "BACTERIA", value: "0", unit: "CFU/100mL", status: "Within safe limits" },
    ],
  };
};
