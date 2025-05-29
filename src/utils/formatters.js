import { format } from 'date-fns';

export const formatTemperature = (temp, unitSystem) => {
  return unitSystem === 'metric'
    ? `${Math.round(temp)}°C`
    : `${Math.round(temp)}°F`;
};

export const formatWindSpeed = (speed, unitSystem) => {
  return unitSystem === 'metric'
    ? `${Math.round(speed)} km/h`
    : `${Math.round(speed)} mph`;
};

export const formatPrecipitation = (precip, unitSystem) => {
  return unitSystem === 'metric'
    ? `${precip} mm`
    : `${precip} in`;
};

export const formatVisibility = (visibility, unitSystem) => {
  return unitSystem === 'metric'
    ? `${visibility} km`
    : `${visibility} mi`;
};

export const formatPressure = (pressure, unitSystem) => {
  return unitSystem === 'metric'
    ? `${pressure} mb`
    : `${pressure} in`;
};

export const formatTime = (dateString) => {
  return format(new Date(dateString), 'h:mm a');
};

export const formatDate = (dateString) => {
  return format(new Date(dateString), 'EEEE, MMM d');
};

export const formatHour = (timeString) => {
  return format(new Date(timeString), 'h a');
};

export const formatDay = (dateString) => {
  return format(new Date(dateString), 'EEE');
};

export const getWeatherBackground = (code, isDay) => {
  // Weather condition codes from WeatherAPI
  // Clear or Sunny
  if (code === 1000) {
    return isDay 
      ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
      : 'bg-gradient-to-br from-gray-900 to-blue-900';
  }
  // Partly cloudy
  else if (code === 1003) {
    return isDay
      ? 'bg-gradient-to-br from-blue-300 to-blue-500'
      : 'bg-gradient-to-br from-gray-800 to-blue-800';
  }
  // Cloudy, Overcast
  else if ([1006, 1009].includes(code)) {
    return isDay
      ? 'bg-gradient-to-br from-gray-300 to-blue-400'
      : 'bg-gradient-to-br from-gray-700 to-gray-900';
  }
  // Mist, Fog, Freezing fog
  else if ([1030, 1135, 1147].includes(code)) {
    return isDay
      ? 'bg-gradient-to-br from-gray-300 to-gray-400'
      : 'bg-gradient-to-br from-gray-600 to-gray-800';
  }
  // Rain conditions
  else if ([1063, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1249, 1252].includes(code)) {
    return isDay
      ? 'bg-gradient-to-br from-gray-400 to-blue-600'
      : 'bg-gradient-to-br from-gray-700 to-blue-900';
  }
  // Snow conditions
  else if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282].includes(code)) {
    return isDay
      ? 'bg-gradient-to-br from-gray-200 to-blue-300'
      : 'bg-gradient-to-br from-gray-700 to-blue-800';
  }
  // Thunderstorm conditions
  else if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return isDay
      ? 'bg-gradient-to-br from-gray-500 to-blue-700'
      : 'bg-gradient-to-br from-gray-800 to-purple-900';
  }
  
  // Default background
  return isDay
    ? 'bg-gradient-to-br from-blue-300 to-blue-500'
    : 'bg-gradient-to-br from-gray-800 to-blue-900';
};

export const getUVIndexLabel = (uvIndex) => {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
};

export const getUVIndexColor = (uvIndex) => {
  if (uvIndex <= 2) return 'text-green-500';
  if (uvIndex <= 5) return 'text-yellow-500';
  if (uvIndex <= 7) return 'text-orange-500';
  if (uvIndex <= 10) return 'text-red-500';
  return 'text-purple-500';
};