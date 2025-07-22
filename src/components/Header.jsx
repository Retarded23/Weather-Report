import React from 'react'
import { WiDaySunny } from 'react-icons/wi'
import { TbWind } from 'react-icons/tb'
import { MdOutlineWaterDrop } from 'react-icons/md'
import { FaCarSide, FaUser, FaBell } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import logo from '../Assets/logo.png';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white/40 backdrop-blur-md border-b border-white/30 shadow flex items-center justify-between px-8 py-2">
      {/* Left: Logo */}
      <div className="flex items-center space-x-8">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10"
        />
      </div>
      <div className="flex-1 flex justify-center">
        {/* Titles + Icons */}
        <nav className="flex items-center space-x-6">
          <button
            className="flex items-center text-lg text-gray-900 hover:text-blue-700 transition focus:outline-none"
            onClick={() => navigate('/')}
          >
            <WiDaySunny className="mr-1 text-2xl" /> Weather
          </button>
          <button
            className="flex items-center text-lg text-gray-900 hover:text-blue-700 transition focus:outline-none"
            onClick={() => navigate('/air-report')}
          >
            <TbWind className="mr-1 text-xl" /> AIR Report
          </button>
          <button
            className="flex items-center text-lg text-gray-900 hover:text-blue-700 transition focus:outline-none"
            onClick={() => navigate('/water-quality')}
          >
            <MdOutlineWaterDrop className="mr-1 text-xl" /> Water Quality
          </button>
          <button
            className="flex items-center text-lg text-gray-900 hover:text-blue-700 transition focus:outline-none"
            onClick={() => navigate('/traffic')}
          >
            <FaCarSide className="mr-1 text-xl" /> Traffic
          </button>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-900 hover:text-blue-700 transition focus:outline-none">
          <FaBell className="text-xl" />
        </button>
        <button className="text-gray-900 hover:text-blue-700 transition focus:outline-none">
          <FaUser className="text-xl" />
        </button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </div>
    </header>
  )
}

export default Header