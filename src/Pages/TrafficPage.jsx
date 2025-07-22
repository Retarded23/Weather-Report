import React, { useState, useEffect } from 'react';
// Make sure the path to your api module is correct
import { 
  fetchTrafficIncidents, 
  fetchNearbyPois, 
  fetchFlowSegmentData 
} from '../services/api';

// A simple helper component for the loading state
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-16">
    <div className="w-16 h-16 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
    <p className="ml-4 text-gray-600">Fetching live data...</p>
  </div>
);

// The main React component for the traffic page
const TrafficPage = () => {
  const [location, setLocation] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [evStations, setEvStations] = useState([]);
  const [petrolPumps, setPetrolPumps] = useState([]);
  const [flowData, setFlowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Get the user's current location when the component mounts
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
        setError(`Error getting your location: ${err.message}. Please enable location services in your browser.`);
        setLoading(false);
      }
    );
  }, []);

  // 2. Fetch all API data once the location is available
  useEffect(() => {
    if (location) {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Fetch all data in parallel for efficiency
          const [
            incidentsData, 
            evData, 
            petrolData, 
            flowSegment
          ] = await Promise.all([
            fetchTrafficIncidents(location.lat, location.lon),
            fetchNearbyPois(location.lat, location.lon, 'electric_vehicle_station'),
            fetchNearbyPois(location.lat, location.lon, 'petrol_station'),
            fetchFlowSegmentData(location.lat, location.lon),
          ]);
          
          // Set the state with the fetched data, providing empty arrays as fallbacks
          setIncidents(incidentsData?.tm?.poi || []);
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

  // 3. Render the UI
  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            Live Traffic Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Real-time traffic and service updates for your area.
          </p>
        </header>

        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md shadow-md" role="alert">
            <p className="font-bold">An Error Occurred</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            
            {/* Card for Current Road Speed */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Road Speed</h2>
              {flowData ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Speed</p>
                    <p className="text-4xl font-bold text-blue-600">{flowData.currentSpeed} km/h</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Free Flow Speed</p>
                    <p className="text-xl text-gray-700">{flowData.freeFlowSpeed} km/h</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time to Cross Segment</p>
                    <p className="text-xl text-gray-700">{Math.round(flowData.currentTravelTime)} seconds</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No road speed data available for this specific location.</p>
              )}
            </div>

            {/* Card for Traffic Incidents */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Traffic Incidents</h2>
              {incidents.length > 0 ? (
                <ul className="space-y-4">
                  {incidents.slice(0, 5).map((incident) => (
                    <li key={incident.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                      <p className="font-bold text-red-600">{incident.poi.name}</p>
                      <p className="text-sm text-gray-600">{incident.d}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No incidents reported nearby.</p>
              )}
            </div>

            {/* Card for EV Charging Stations */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">EV Charging</h2>
              {evStations.length > 0 ? (
                <ul className="space-y-3">
                  {evStations.slice(0, 5).map((station) => (
                    <li key={station.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                      <p className="font-bold text-green-700">{station.poi.name}</p>
                      <p className="text-sm text-gray-600">{station.address.freeformAddress}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No EV stations found nearby.</p>
              )}
            </div>

            {/* Card for Petrol Pumps */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Petrol Pumps</h2>
              {petrolPumps.length > 0 ? (
                <ul className="space-y-3">
                  {petrolPumps.slice(0, 5).map((pump) => (
                    <li key={pump.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                      <p className="font-bold text-indigo-700">{pump.poi.name}</p>
                      <p className="text-sm text-gray-600">{pump.address.freeformAddress}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No petrol pumps found nearby.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficPage;
