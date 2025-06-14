import React, { useEffect, useState } from 'react';

const FavList = ({ onSelectFavorite }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(favs);
  }, []);

  return (
    <div className="bg-white/10 border border-white/30 rounded-xl shadow-lg p-5 m- w-auto h-fit-screen backdrop-blur-md overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2 text-white text-center">❤️ Favorite Locations</h3>
      {favorites.length === 0 ? (
        <p className="text-sm text-white/70 text-center">No favorites added yet.</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((fav, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-white bg-white/5 rounded-lg px-3 py-2 justify-between"
            >
              <span>
                {fav.name ? `${fav.name}, ${fav.country}` : fav}
              </span>
              <button
                className="text-white hover:text-blue-400 transition"
                onClick={() => onSelectFavorite(fav)}
                title="Show weather"
              >
                {/* Right arrow SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavList;