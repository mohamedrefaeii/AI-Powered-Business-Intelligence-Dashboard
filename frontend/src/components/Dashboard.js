import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const Dashboard = () => {
  const [data, setData] = useState({
    stocks: [],
    cryptos: [],
    weather: {},
    news: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [stocks, cryptos, weather, news] = await Promise.all([
        axios.get('http://localhost:3001/api/stocks'),
        axios.get('http://localhost:3001/api/crypto'),
        axios.get('http://localhost:3001/api/weather?city=New%20York'),
        axios.get('http://localhost:3001/api/news')
      ]);

      setData({
        stocks: stocks.data.data,
        cryptos: cryptos.data.data,
        weather: weather.data.data,
        news: news.data.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Stocks</h3>
          <p className="text-3xl font-bold text-blue-600">{data.stocks.length}</p>
          <p className="text-sm text-gray-500">Active stocks</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Cryptos</h3>
          <p className="text-3xl font-bold text-green-600">{data.cryptos.length}</p>
          <p className="text-sm text-gray-500">Active cryptocurrencies</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Weather</h3>
          <p className="text-3xl font-bold text-orange-600">{data.weather?.temperature || 0}°C</p>
          <p className="text-sm text-gray-500">{data.weather?.city || 'Loading...'}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">News Articles</h3>
          <p className="text-3xl font-bold text-purple-600">{data.news.length}</p>
          <p className="text-sm text-gray-500">Latest articles</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Performance</h3>
          <Plot
            data={[{
              x: data.stocks.map(stock => stock.symbol),
              y: data.stocks.map(stock => stock.price),
              type: 'bar',
              marker: { color: 'blue' }
            }]}
            layout={{
              title: 'Stock Prices',
              xaxis: { title: 'Symbol' },
              yaxis: { title: 'Price ($)' }
            }}
            config={{ responsive: true }}
            style={{ width: '100%', height: '300px' }}
          />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crypto Performance</h3>
          <Plot
            data={[{
              x: data.cryptos.map(crypto => crypto.symbol),
              y: data.cryptos.map(crypto => crypto.price),
              type: 'line',
              marker: { color: 'green' }
            }]}
            layout={{
              title: 'Crypto Prices',
              xaxis: { title: 'Symbol' },
              yaxis: { title: 'Price ($)' }
            }}
            config={{ responsive: true }}
            style={{ width: '100%', height: '300px' }}
          />
        </div>
      </div>

      {/* Weather Widget */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Weather</h3>
        {data.weather && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{data.weather.temperature}°C</p>
              <p className="text-sm text-gray-500">{data.weather.city}</p>
            </div>
            <div>
              <p className="text-sm">{data.weather.weather_description}</p>
              <p className="text-xs text-gray-500">Humidity: {data.weather.humidity}%</p>
            </div>
          </div>
        )}
      </div>

      {/* News Feed */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest News</h3>
        <div className="space-y-4">
          {data.news.slice(0, 5).map((article, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h4 className="font-medium text-gray-900">{article.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{article.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                {article.source} • {article.published_at}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
