import React, { useState, useEffect } from 'react';
import axios from 'react';
import Plot from 'react-plotly.js';

const WeatherPage = () => {
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/weather?city=New%20York');
      setWeather(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Weather Forecast</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Weather</h3>
            {weather && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">{weather.temperature}°C</p>
                    <p className="text-lg font-medium">{weather.city}</p>
                  </div>
                  <div>
                    <p className="text-sm">{weather.weather_description}</p>
                    <p className="text-xs text-gray-500">Humidity: {weather.humidity}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Wind Speed</p>
                    <p className="text-lg">{weather.wind_speed} m/s</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pressure</p>
                    <p className="text-lg">{weather.pressure} hPa</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Forecast</h3>
            <Plot
              data={[{
                x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                y: [20, 22, 25, 23, 21, 19, 18],
                type: 'line',
                marker: { color: 'orange' }
              }]}
              layout={{
                title: '7-Day Weather Forecast',
                xaxis: { title: 'Day' },
                yaxis: { title: 'Temperature (°C)' }
              }}
              config={{ responsive: true }}
              style={{ width: '100%', height: '300px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
