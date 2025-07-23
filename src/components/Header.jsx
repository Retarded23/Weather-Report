import React, { useState } from 'react'
import { WiDaySunny } from 'react-icons/wi'
import { TbWind } from 'react-icons/tb'
import { MdOutlineWaterDrop } from 'react-icons/md'
import { FaCarSide, FaUser, FaBell, FaBars, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import logo from '../Assets/logo.png';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { icon: <WiDaySunny className="text-2xl" />, text: 'Weather', path: '/' },
    { icon: <TbWind className="text-xl" />, text: 'AIR Report', path: '/air-report' },
    { icon: <MdOutlineWaterDrop className="text-xl" />, text: 'Water Quality', path: '/water-quality' },
    { icon: <FaCarSide className="text-xl" />, text: 'Traffic', path: '/traffic' },
  ];

  return (
    <header className="w-full bg-white/40 backdrop-blur-md border-b border-white/30 shadow">
      <div className="flex items-center justify-between px-4 md:px-8 py-2">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-10 h-10" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                className="flex items-center text-lg text-gray-900 hover:text-blue-700 transition focus:outline-none"
                onClick={() => navigate(item.path)}
              >
                <span className="mr-1">{item.icon}</span>
                <span className="hidden lg:inline">{item.text}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-900 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Login
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md">
          <nav className="flex flex-col py-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                className="flex items-center space-x-3 px-6 py-3 text-lg text-gray-900 hover:bg-blue-50 transition focus:outline-none"
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
              >
                {item.icon}
                <span>{item.text}</span>
              </button>
            ))}
            <button className="mx-6 mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Login
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header