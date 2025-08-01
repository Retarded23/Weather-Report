import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import { WeatherProvider } from './context/WeatherContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WeatherProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WeatherProvider>
  </React.StrictMode>
);
