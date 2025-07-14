import Header from './components/Header';
import Weather from './Pages/Weather';
import AirReport from './Pages/AirReport';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col">
      <Header />
      <Routes className="items-center">
        <Route path="/" element={<Weather />} />
        <Route path="/air-report" element={<AirReport />} />
        {/* Add other routes here */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;