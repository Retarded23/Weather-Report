import axios from 'axios';


const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;
const BASE_URL1 = 'https://api.tomtom.com';

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

const fields =
  'incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code,iconCategory},startTime,endTime,from,to,length,delay,roadNumbers,timeValidity,probabilityOfOccurrence,numberOfReports,lastReportTime,tmc{countryCode,tableNumber,tableVersion,direction,points{location,offset}}}}';

console.log(fields);

export const fetchTrafficIncidents = async (lat, lon) => {
  const bbox = `${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}`;
  try {
    const response = await axios.get(`${BASE_URL1}/traffic/services/5/incidentDetails`, {
      params: {
        key: TOMTOM_API_KEY,
        bbox: bbox,
        language: 'en-GB',
        fields,
        timeValidityFilter: 'present',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching traffic incidents:', error.response?.data || error.message);
    throw new Error('Failed to fetch traffic incidents.');
  }
};


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
