import React, { useState, useEffect } from 'react';
import axios from 'react';
import Plot from 'react-plotly.js';

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/stocks');
      setStocks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setLoading(false);
    }
  };

  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Stock Market</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Stocks</h3>
            <div className="space-y-4">
              {stocks.map((stock) => (
                <div key={stock.symbol} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">{stock.symbol}</h4>
                    <p className="text-sm text-gray-600">${stock.price}</p>
                  </div>
                  <button
                    onClick={() => handleStockSelect(stock.symbol)}
                    className="btn-primary text-sm"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Chart</h3>
            <Plot
              data={[{
                x: stocks.map(stock => stock.symbol),
                y: stocks.map(stock => stock.price),
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
        </div>
      )}
    </div>
  );
};

export default StocksPage;
