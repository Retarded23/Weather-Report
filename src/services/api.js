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

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;
const BASE_URL1 = 'https://api.tomtom.com';

/**
 * Fetches traffic incidents near a specific geographic coordinate.
 */
export const fetchTrafficIncidents = async (lat, lon) => {
  const boundingBox = `${lat - 0.1},${lon - 0.1},${lat + 0.1},${lon + 0.1}`;
  try {
    const response = await axios.get(
      `${BASE_URL1}/traffic/services/4/incidentDetails/s3/${boundingBox}/-11/132/2/-1/json`, {
        params: {
          key: TOMTOM_API_KEY,
          projection: 'EPSG4326',
          language: 'en-US',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching traffic incidents:', error);
    // Re-throw the error so the calling component can handle it
    throw new Error('Failed to fetch traffic incidents.');
  }
};

/**
 * Fetches nearby points of interest (POIs).
 */
export const fetchNearbyPois = async (lat, lon, category) => {
  try {
    const response = await axios.get(
      `${BASE_URL1}/search/2/nearbySearch/${category}.json`, {
        params: {
          key: TOMTOM_API_KEY,
          lat: lat,
          lon: lon,
          radius: 10000, // Search within a 10km radius
          limit: 10,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching nearby ${category}:`, error);
    throw new Error(`Failed to fetch nearby ${category}.`);
  }
};

/**
 * Fetches real-time speed and travel time for the road segment.
 */
export const fetchFlowSegmentData = async (lat, lon) => {
  try {
    const response = await axios.get(
      `${BASE_URL1}/traffic/services/4/flowSegmentData/absolute/10/json`, {
        params: {
          key: TOMTOM_API_KEY,
          point: `${lat},${lon}`,
        },
      }
    );
    return response.data.flowSegmentData;
  } catch (error) {
    console.error('Error fetching flow segment data:', error);
    // Gracefully handle the 404 error when no road is found
    if (error.response && error.response.status === 404) {
      return null;
    }
    // For all other errors, throw an exception
    throw new Error('Failed to fetch flow segment data.');
  }
};
