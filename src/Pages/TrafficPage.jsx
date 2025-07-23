import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaChargingStation, FaGasPump, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { fetchNearbyPois, fetchFlowSegmentData } from '../services/api';

// --- Reusable UI Components ---

// Card component for the frosted glass effect
const TrafficCard = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 flex flex-col p-6 h-full ${className}`}>
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-bold text-white ml-3">{title}</h2>
    </div>
    <div className="flex-grow flex flex-col">
      {children}
    </div>
  </div>
);

// List item for stations
const StationItem = ({ name, address }) => (
  <div className="flex items-start py-3 border-b border-white/30 last:border-b-0">
    <FaMapMarkerAlt className="text-white/80 mt-1 mr-4 flex-shrink-0" />
    <div>
      <p className="font-semibold text-white">{name}</p>
      <p className="text-sm text-gray-200">{address}</p>
    </div>
  </div>
);

// Full-screen loading indicator
const LoadingState = () => (
  <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 to-indigo-700 flex justify-center items-center text-white">
    <div className="text-center">
      <svg className="animate-spin h-8 w-8 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-xl font-semibold">Fetching Live Data...</p>
    </div>
  </div>
);

// --- Main Traffic Page Component ---

const TrafficPage = () => {
  const [location, setLocation] = useState(null);
  const [evStations, setEvStations] = useState([]);
  const [petrolPumps, setPetrolPumps] = useState([]);
  const [flowData, setFlowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Logic to get user location (unchanged)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setError('');
      },
      (err) => {
        setError(`Location Error: ${err.message}. Please enable location services.`);
        setLoading(false);
      }
    );
  }, []);

  // Logic to fetch data based on location (unchanged)
  useEffect(() => {
    if (location) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [evData, petrolData, flowSegment] = await Promise.all([
            fetchNearbyPois(location.lat, location.lon, 'electric_vehicle_station'), // EV Station ID
            fetchNearbyPois(location.lat, location.lon, 'petrol_station'), // Petrol/Gas Station ID
            fetchFlowSegmentData(location.lat, location.lon),
          ]);
          setEvStations(evData?.results || []);
          setPetrolPumps(petrolData?.results || []);
          setFlowData(flowSegment);
        } catch (err) {
          setError(err.message || 'An unknown error occurred while fetching data.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [location]);

  // --- Render Logic ---

  if (loading) {
    return <LoadingState />;
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-700 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Live Traffic Dashboard</h1>
          <p className="text-gray-200 mt-2">Real-time traffic and service updates for your area.</p>
        </header>

        {error && (
          <div className="bg-red-500/30 backdrop-blur-md border border-red-400/50 text-white p-4 rounded-xl shadow-lg mb-8 max-w-3xl mx-auto">
             <div className="flex items-center">
               <FaExclamationTriangle className="text-red-300 h-6 w-6 mr-3" />
               <div>
                  <p className="font-bold">An Error Occurred</p>
                  <p className="text-red-200">{error}</p>
               </div>
             </div>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <TrafficCard title="Current Road Speed" icon={<FaTachometerAlt size={24} />}>
              {flowData ? (
                <div className="text-center flex flex-col justify-center h-full">
                  <p className="text-6xl md:text-7xl font-bold text-yellow-300">
                    {flowData.currentSpeed}
                    <span className="text-2xl font-medium text-white/90 ml-2">km/h</span>
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">{flowData.freeFlowSpeed} km/h</p>
                      <p className="text-sm text-gray-200">Free Flow</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{Math.floor(flowData.currentTravelTime / 60)}m {flowData.currentTravelTime % 60}s</p>
                      <p className="text-sm text-gray-200">Travel Time</p>
                    </div>
                  </div>
                </div>
              ) : <p className="text-center m-auto text-gray-300">No speed data available.</p>}
            </TrafficCard>

            <TrafficCard title="EV Charging Stations" icon={<FaChargingStation size={24} />}>
              {evStations.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {evStations.slice(0, 5).map(station => (
                    <StationItem key={station.id} name={station.poi.name} address={station.address.freeformAddress} />
                  ))}
                </div>
              ) : <p className="text-center m-auto text-gray-300">No EV stations found nearby.</p>}
            </TrafficCard>

            <TrafficCard title="Petrol Pumps" icon={<FaGasPump size={24} />}>
              {petrolPumps.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {petrolPumps.slice(0, 5).map(pump => (
                    <StationItem key={pump.id} name={pump.poi.name} address={pump.address.freeformAddress} />
                  ))}
                </div>
              ) : <p className="text-center m-auto text-gray-300">No petrol pumps found nearby.</p>}
            </TrafficCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficPage;

