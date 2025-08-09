import React, { useState, useEffect } from 'react';
import axios from 'react';
import { Link } from 'react-router-dom';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/news');
      setNews(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Latest News</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{article.description}</p>
              <p className="text-xs text-gray-500">{article.source} • {article.published_at}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
