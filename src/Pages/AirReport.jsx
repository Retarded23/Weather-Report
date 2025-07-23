import React, { useEffect, useState } from 'react';
import { fetchLocationByCoordinates } from '../services/api';
import { TbWind } from 'react-icons/tb'
const AQICategories = [
  {
    level: 'Good',
    range: '0-50',
    color: 'bg-green-400',
    description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    recommendation: 'Enjoy outdoor activities as usual. Keep windows open for fresh air. No need for masks or air purifiers.'
  },
  {
    level: 'Moderate',
    range: '51-100',
    color: 'bg-yellow-300',
    description: 'Air quality is acceptable; however, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
    recommendation: 'Sensitive individuals should consider limiting prolonged outdoor exertion. Monitor symptoms if you have asthma or allergies. Consider using air purifiers indoors.'
  },
  {
    level: 'Unhealthy for Sensitive Groups',
    range: '101-150',
    color: 'bg-orange-400',
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    recommendation: 'Children, elderly, and people with respiratory issues should reduce outdoor activities. Avoid outdoor exercise. Use masks if going outside. Keep air purifiers running indoors.'
  },
  {
    level: 'Unhealthy',
    range: '151-200',
    color: 'bg-red-500',
    description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
    recommendation: 'Limit outdoor activities for everyone. Wear N95 masks if you must go outside. Keep doors and windows closed. Use air purifiers and avoid strenuous activities.'
  },
  {
    level: 'Very Unhealthy',
    range: '201-300',
    color: 'bg-purple-800',
    description: 'Health alert: everyone may experience more serious health effects.',
    recommendation: 'Avoid outdoor activities. Stay indoors as much as possible. Use high-quality air purifiers. Seek medical attention if you experience breathing difficulties. Follow local health advisories.'
  },
  {
    level: 'Hazardous',
    range: '301-500',
    color: 'bg-red-800',
    description: 'Health warnings of emergency conditions. The entire population is more likely to be affected.',
    recommendation: 'Stay indoors and avoid all outdoor activities. Follow government health advisories and emergency instructions. Use air purifiers and keep windows/doors sealed. Seek medical help if symptoms worsen.'
  }
];

function AirReport() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          fetchLocationByCoordinates(latitude, longitude)
            .then(data => {
              setWeather(data);
              setLoading(false);
            })
            .catch(() => {
              setError('Failed to fetch data for your location.');
              setLoading(false);
            });
        },
        () => {
          setError('Location access denied.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return(
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <TbWind className="animate-bounce mx-auto mb-4" size={48} />
          <p className="text-xl">Loading weather data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <TbWind className="mx-auto mb-4" size={48} />
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => searchLocation('London')}
            className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  if (!weather) return null;

  // Extract AQI and forecast
  const aqi = weather?.current?.air_quality?.pm2_5 || 0;
  const pollutants = weather?.current?.air_quality || {};
 
  // Find AQI category
  const currentCategory = AQICategories.find(cat => {
    const [min, max] = cat.range.split('-').map(Number);
    return aqi >= min && aqi <= max;
  });

  return (
    <div>
      <div className="w-auto bg-white/40 border-white mx-10 my-8 p-6 rounded-xl shadow-lg backdrop-blur-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Air Quality Index (AQI) Report</h1>
      <div className={`p-4 rounded-lg mb-6 text-white ${currentCategory?.color || 'bg-gray-400'}`}>
        <div className="flex items-center justify-between gap-10">
          <div>
            <p className="text-xl text-black font-semibold">Current PM2.5 AQI: <span className="text-2xl">{aqi.toFixed(0)}</span></p>
            <p className="text-lg text-black">{currentCategory?.level}</p>
          </div>
          
          <div>
            <p className="italic wrap text-black">{currentCategory?.description}</p>
          </div>
        </div>
      </div>

      {/* Pollution Breakdown Section */}
      <h2 className="text-2xl font-semibold mb-4 text-black">Pollutant Breakdown</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {/* PM2.5 */}
        <div className="bg-gradient-to-br from-indigo-500/70 via-purple-500/70 to-pink-400/70 rounded-2xl p-5 shadow-xl border border-white/20">
          <p className="font-bold mb-1 text-white/90">PM25</p>
          <div className="flex items-end mb-1">
            <span className="text-3xl font-bold text-white">{pollutants.pm2_5?.toFixed(0) || 'N/A'}</span>
            <span className="ml-2 text-base text-white/70">µg/m³</span>
          </div>
          <div className="h-2 rounded bg-white/30 mt-2">
            <div
              className="h-2 rounded bg-yellow-400 transition-all duration-500"
              style={{ width: `${Math.min((pollutants.pm2_5 || 0) / 150 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        {/* PM10 */}
        <div className="bg-gradient-to-br from-indigo-500/70 via-purple-500/70 to-pink-400/70 rounded-2xl p-5 shadow-xl border border-white/20">
          <p className="font-bold mb-1 text-white/90">PM10</p>
          <div className="flex items-end mb-1">
            <span className="text-3xl font-bold text-white">{pollutants.pm10?.toFixed(0) || 'N/A'}</span>
            <span className="ml-2 text-base text-white/70">µg/m³</span>
          </div>
          <div className="h-2 rounded bg-white/30 mt-2">
            <div
              className="h-2 rounded bg-blue-400 transition-all duration-500"
              style={{ width: `${Math.min((pollutants.pm10 || 0) / 150 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        {/* O3 */}
        <div className="bg-gradient-to-br from-indigo-500/70 via-purple-500/70 to-pink-400/70 rounded-2xl p-5 shadow-xl border border-white/20">
          <p className="font-bold mb-1 text-white/90">O3</p>
          <div className="flex items-end mb-1">
            <span className="text-3xl font-bold text-white">{pollutants.o3?.toFixed(0) || 'N/A'}</span>
            <span className="ml-2 text-base text-white/70">µg/m³</span>
          </div>
          <div className="h-2 rounded bg-white/30 mt-2">
            <div
              className="h-2 rounded bg-blue-400 transition-all duration-500"
              style={{ width: `${Math.min((pollutants.o3 || 0) / 150 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        {/* NO2 */}
        <div className="bg-gradient-to-br from-indigo-500/70 via-purple-500/70 to-pink-400/70 rounded-2xl p-5 shadow-xl border border-white/20">
          <p className="font-bold mb-1 text-white/90">NO2</p>
          <div className="flex items-end mb-1">
            <span className="text-3xl font-bold text-white">{pollutants.no2?.toFixed(0) || 'N/A'}</span>
            <span className="ml-2 text-base text-white/70">µg/m³</span>
          </div>
          <div className="h-2 rounded bg-white/30 mt-2">
            <div
              className="h-2 rounded bg-blue-400 transition-all duration-500"
              style={{ width: `${Math.min((pollutants.no2 || 0) / 150 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        {/* SO2 */}
        <div className="bg-gradient-to-br from-indigo-500/70 via-purple-500/70 to-pink-400/70 rounded-2xl p-5 shadow-xl border border-white/20">
          <p className="font-bold mb-1 text-white/90">SO2</p>
          <div className="flex items-end mb-1">
            <span className="text-3xl font-bold text-white">{pollutants.so2?.toFixed(0) || 'N/A'}</span>
            <span className="ml-2 text-base text-white/70">µg/m³</span>
          </div>
          <div className="h-2 rounded bg-white/30 mt-2">
            <div
              className="h-2 rounded bg-blue-400 transition-all duration-500"
              style={{ width: `${Math.min((pollutants.so2 || 0) / 150 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        {/* CO */}
        <div className="bg-gradient-to-br from-indigo-500/70 via-purple-500/70 to-pink-400/70 rounded-2xl p-5 shadow-xl border border-white/20">
          <p className="font-bold mb-1 text-white/90">CO</p>
          <div className="flex items-end mb-1">
            <span className="text-3xl font-bold text-white">{pollutants.co?.toFixed(0) || 'N/A'}</span>
            <span className="ml-2 text-base text-white/70">µg/m³</span>
          </div>
          <div className="h-2 rounded bg-white/30 mt-2">
            <div
              className="h-2 rounded bg-blue-400 transition-all duration-500"
              style={{ width: `${Math.min((pollutants.co || 0) / 150 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        {/* TEMP */}
        <div className="bg-gradient-to-br from-indigo-500/70 via-purple-500/70 to-pink-400/70 rounded-2xl p-5 shadow-xl border border-white/20">
          <p className="font-bold mb-1 text-white/90">TEMP</p>
          <div className="flex items-end mb-1">
            <span className="text-3xl font-bold text-white">{weather.current.temp_c?.toFixed(0) || 'N/A'}</span>
            <span className="ml-2 text-base text-white/70">°C</span>
          </div>
          <div className="h-2 rounded bg-white/30 mt-2">
            <div
              className="h-2 rounded bg-blue-400 transition-all duration-500"
              style={{ width: `${Math.min((weather.current.temp_c || 0) / 50 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        {/* HUMIDITY */}
        <div className="bg-gradient-to-br from-indigo-500/70 via-purple-500/70 to-pink-400/70 rounded-2xl p-5 shadow-xl border border-white/20">
          <p className="font-bold mb-1 text-white/90">HUMIDITY</p>
          <div className="flex items-end mb-1">
            <span className="text-3xl font-bold text-white">{weather.current.humidity?.toFixed(0) || 'N/A'}</span>
            <span className="ml-2 text-base text-white/70">%</span>
          </div>
          <div className="h-2 rounded bg-white/30 mt-2">
            <div
              className="h-2 rounded bg-blue-400 transition-all duration-500"
              style={{ width: `${Math.min((weather.current.humidity || 0), 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-black">Health Recommendation</h2>
      <div className="bg-white/50 rounded-lg p-4 mb-6 ">
        <p>{currentCategory?.recommendation}</p>
      </div>
      </div>
      <div className="w-auto bg-white/40 border-white mx-10 my-8 p-6 rounded-xl shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-4 text-black">AQI Categories & Recommendations</h2>
        <AQICategoryTabs categories={AQICategories} />
      </div>
      
    </div>
  );
}

function AQICategoryTabs({ categories }) {
  const [selected, setSelected] = useState(categories[0]);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat.level}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all
              ${selected.level === cat.level
                ? 'border-2 border-white bg-white/20 text-black'
                : 'bg-white/10 text-black/80 hover:bg-white/20'}`}
          >
            {cat.level}
          </button>
        ))}
      </div>
      {/* Details */}
      <div className={`rounded-xl p-6 mb-6 ${selected.color} bg-opacity-80 flex flex-col md:flex-row gap-8`}>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2 text-balck flex items-center gap-2">
            {/* Example icon, replace with your own */}
            <span role="img" aria-label="alert">⚠️</span>
            {selected.level}
          </h3>
          <p className="mb-2 text-balck/90">AQI Range: {selected.range}</p>
          <p className="mb-4 text-balck">{selected.description}</p>
          <h4 className="font-semibold text-balck mb-2">Health Recommendation</h4>
          <ul className="list-disc ml-5 text-balck/90">
            {selected.recommendation.split('. ').map((rec, i) =>
              rec.trim() && <li key={i}>{rec.trim()}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AirReport;