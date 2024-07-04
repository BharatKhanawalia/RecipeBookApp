// Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = ({ handleSubmit, search, setSearch }) => {
  const [showSearchBar, setShowSearchBar] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setShowSearchBar(true);
    } else {
      setShowSearchBar(false);
    }
  }, [location.pathname]);

  return (
    <div>
      <h1 className="app-title">Recipe Book</h1>
      {showSearchBar && (
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search for recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      )}
      <Outlet />
    </div>
  );
};

export default Layout;
