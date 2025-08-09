import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Stocks', href: '/stocks', icon: '📈' },
    { name: 'Crypto', href: '/crypto', icon: '₿' },
    { name: 'Weather', href: '/weather', icon: '🌤️' },
    { name: 'News', href: '/news', icon: '📰' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                location.pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
