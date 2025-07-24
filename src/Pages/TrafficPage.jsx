import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaChargingStation, FaGasPump, FaMapMarkerAlt, FaExclamationTriangle, FaSpinner, FaMapPin } from 'react-icons/fa';
import { fetchNearbyPois, fetchFlowSegmentData } from '../services/api';

// --- UI Components (No visual changes, but adapted for API data structure) ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>{children}</div>
);

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center text-gray-500 mb-4">
    {React.createElement(icon, { className: "mr-3 text-blue-500" })}
    <h2 className="font-semibold tracking-wide uppercase text-sm">{title}</h2>
  </div>
);

const CurrentRoadSpeedCard = ({ flowData }) => {
  if (!flowData) {
    return (
        <Card className="flex flex-col items-center justify-center text-center h-full">
            <p className="text-gray-500">No speed data available.</p>
        </Card>
    );
  }
  
  const { currentSpeed, freeFlowSpeed, currentTravelTime } = flowData;
  const speedPercentage = (currentSpeed / (freeFlowSpeed > 0 ? freeFlowSpeed : 100)) * 100;

  return (
    <Card className="flex flex-col items-center justify-center text-center">
      <SectionTitle icon={FaTachometerAlt} title="Current Road Speed" />
      <div className="relative w-48 h-48 my-4">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="text-blue-500"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${speedPercentage}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-gray-800">{currentSpeed}</span>
          <span className="text-lg text-gray-600">km/h</span>
        </div>
      </div>
      <div className="flex justify-between w-full max-w-xs text-center">
        <div>
          <p className="text-gray-500 text-sm">Free Flow</p>
          <p className="font-semibold text-lg text-gray-700">{freeFlowSpeed} km/h</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Travel Time</p>
          <p className="font-semibold text-lg text-gray-700">{Math.floor(currentTravelTime / 60)}m {currentTravelTime % 60}s</p>
        </div>
      </div>
    </Card>
  );
};

const PoiListCard = ({ title, icon, items, emptyMessage }) => {
  return (
    <Card>
      <SectionTitle icon={icon} title={title} />
      <div className="space-y-4 overflow-y-auto max-h-64 pr-2">
        {items.length > 0 ? items.map((item) => (
          <div key={item.id} className="flex items-start hover:bg-gray-50 p-2 rounded-md transition-colors">
            <FaMapMarkerAlt className="text-gray-400 mt-1 mr-4 flex-shrink-0" />
            <div>
              {/* Adapted to TomTom API response structure */}
              <p className="font-semibold text-gray-800">{item.poi.name}</p>
              <p className="text-sm text-gray-500">{item.address.freeformAddress}</p>
            </div>
          </div>
        )) : (
          <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
        )}
      </div>
    </Card>
  );
};

// --- Full Page Component with Geolocation Logic ---

const TrafficPage = () => {
  const [location, setLocation] = useState(null);
  const [flowData, setFlowData] = useState(null);
  const [evStations, setEvStations] = useState([]);
  const [petrolPumps, setPetrolPumps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Effect to get user's location once
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setError(''); // Clear any previous errors
      },
      (err) => {
        setError(`Location Error: ${err.message}. Please enable location services to use the dashboard.`);
        setLoading(false); // Stop loading as we cannot proceed
      }
    );
  }, []); // Empty dependency array ensures this runs only once on mount

  // 2. Effect to fetch data when location is available
  useEffect(() => {
    if (location) {
      const fetchData = async () => {
        try {
          setLoading(true); // Set loading to true for data fetching phase
          const [evData, petrolData, flowSegment] = await Promise.all([
            fetchNearbyPois(location.lat, location.lon, 'electric_vehicle_station'),
            fetchNearbyPois(location.lat, location.lon, 'petrol_station'),
            fetchFlowSegmentData(location.lat, location.lon),
          ]);
          setEvStations(evData?.results || []);
          setPetrolPumps(petrolData?.results || []);
          setFlowData(flowSegment);
          setError(null);
        } catch (err) {
          setError(err.message || 'An unexpected error occurred.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [location]); // This effect runs whenever the location state changes

  // --- Render logic based on loading and error states ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-600">
        <FaSpinner className="animate-spin text-4xl mb-4" />
        <h2 className="text-2xl font-semibold">
          {location ? 'Fetching Live Data...' : 'Requesting Location...'}
        </h2>
        <p>Please wait a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-8 text-center">
        <FaExclamationTriangle className="text-4xl mb-4" />
        <h2 className="text-2xl font-semibold mb-2">An Error Occurred</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Live Traffic Dashboard</h1>
        <p className="text-gray-600 mt-2">Real-time traffic and service updates for your area.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <CurrentRoadSpeedCard flowData={flowData} />
        </div>
        <div className="grid grid-cols-1 gap-8">
          <PoiListCard title="EV Charging Stations" icon={FaChargingStation} items={evStations} emptyMessage="No EV stations found nearby." />
          <PoiListCard title="Petrol Pumps" icon={FaGasPump} items={petrolPumps} emptyMessage="No petrol pumps found nearby." />
        </div>
      </main>
    </div>
  );
};

export default TrafficPage;
