import React, { useEffect, useState } from 'react';
import { MdOutlineWaterDrop } from 'react-icons/md';
// Placeholder: you'll implement or replace this API function as needed
import { fetchWaterQualityData } from '../services/api';


function WaterReport() {
  const [waterData, setWaterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState(null); // "call" or "report" or null

  useEffect(() => {
    const getWaterQuality = async () => {
      try {
        const data = await fetchWaterQualityData(); // to be implemented
        setWaterData(data.measurements || []);
        setTimestamp(data.lastUpdated || new Date().toISOString());
      } catch (error) {
        console.error('Failed to fetch water quality data:', error);
      } finally {
        setLoading(false);
      }
    };

    getWaterQuality();
  }, []);
  
  if (loading) {
      return(
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center">
            <MdOutlineWaterDrop className="animate-bounce mx-auto mb-4" size={48} />
            <p className="text-xl">Loading weather data...</p>
          </div>
        </div>
      );
    }
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
    if (!waterData) return null;

  return (
    <div>
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 text-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
            {modalType === 'call' && (
              <>
                <h2 className="text-xl font-bold mb-4">Call Pollution Control Board</h2>
                <p className="mb-6">
                  Would you like to call the Pollution Control Board at <span className="font-semibold text-blue-400">155305</span> to report this issue?
                </p>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setModalType(null)} className="border px-4 py-2 rounded text-white bg-transparent border-gray-400 hover:bg-gray-700">
                    Cancel
                  </button>
                  <a href="tel:155305" onClick={() => setModalType(null)} className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600">
                    📞 Call 155305
                  </a>
                </div>
              </>
            )}
            {modalType === 'report' && (
              <>
                <h2 className="text-xl font-bold mb-4">Report Water Quality Issue</h2>
                <p className="mb-6">
                  Would you like to report a water quality issue via our online portal?
                </p>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setModalType(null)} className="border px-4 py-2 rounded text-white bg-transparent border-gray-400 hover:bg-gray-700">
                    Cancel
                  </button>
                  <a
                    href="https://your.report.portal/" // Replace with a real URL
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
                  >
                    📝 Report Issue
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    <div className=" w-auto bg-white/40 border-b border-white/30 mx-10 my-8 px-4 p-6 rounded-xl shadow-lg backdrop-blur-md  ">
     
      <h2 className="text-3xl font-bold mb-4 text-gray-900">Water Quality Report</h2>
      <p className="text-xl text-black-500 mb-4">
        Data extracted from external monitoring sources
        <br />
        <strong>Delhi Municipal Supply</strong>
      </p>

      {loading ? (
        <p>Loading water quality data...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {waterData.map((param, index) => (
            <div
              key={index}
              className={` p-4 rounded-md shadow-sm ${
                param.error ? 'bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-red-900/40 rounded-2xl shadow-xl border border-white/40' : "bg-gradient-to-br from-indigo-500/20 via-purple-500/80 to-pink-900/30 rounded-2xl shadow-xl border border-white/40"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <MdOutlineWaterDrop className="text-blue-500" size={20} />
                <span className="font-medium">{param.label}</span>
              </div>
              <div className="text-lg font-semibold">
                {param.value} {param.unit}
              </div>
              <div className="text-sm text-gray-600">{param.status}</div>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-black-400 mt-4">
        Last updated: {new Date(timestamp).toLocaleString()}
        <br />
        Source: Delhi Water Quality Monitoring Networks
      </p>
    </div>

      {/* Water Safety Information Section */}
      <div className="w-auto bg-white/40 border-b border-white/30 mx-10 my-8 px-4 p-6 rounded-xl shadow-lg backdrop-blur-md">
        <strong className=" text-black mb-4 ">Water Safety Information</strong>
        <p className="text-sm text-black mb-4">
          Understanding water quality parameters and health impacts
        </p>
        {/*info*/}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-200 rounded-md p-4">
            <span className="block font-bold text-blue-900 mb-1">pH Level</span>
            <span className="block text-xs text-blue-900 mb-1">Safe range: 6.5–8.5</span>
            <span className="block text-xs">Affects taste and pipe corrosion.<br />Extreme values can cause digestive issues.</span>
          </div>
          <div className="bg-yellow-100 rounded-md p-4">
            <span className="block font-bold text-yellow-900 mb-1">Total Dissolved Solids</span>
            <span className="block text-xs text-yellow-900 mb-1">Safe limit: &lt;500 mg/L</span>
            <span className="block text-xs">High levels affect taste and can indicate contamination.</span>
          </div>
          <div className="bg-teal-100 rounded-md p-4">
            <span className="block font-bold text-teal-900 mb-1">Water Hardness</span>
            <span className="block text-xs text-teal-900 mb-1">Safe limit: &lt;300 mg/L CaCO₃</span>
            <span className="block text-xs">Hard water can cause scale buildup but isn't typically a health concern.</span>
          </div>
          <div className="bg-purple-100 rounded-md p-4">
            <span className="block font-bold text-purple-900 mb-1">UV Index</span>
            <span className="block text-xs text-purple-900 mb-1">Safe level: &lt;3</span>
            <span className="block text-xs">Measures ultraviolet radiation levels. High UV can damage skin and eyes.</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button
            className="bg-blue-400 text-white p-2 rounded-md text-sm flex-1"
            onClick={() => setModalType("call")}
          >
            📞 Contact Pollution Control Board
          </button>
          <button
            className="bg-blue-200 text-blue-900 p-2 rounded-md text-sm flex-1"
            onClick={() => setModalType("report")}
          >
            📝 Report Water Quality Issue
          </button>
        </div>

      </div>

    </div>
  );
}

export default WaterReport;
