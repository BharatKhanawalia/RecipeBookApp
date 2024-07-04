import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from './components/Card';
import RecipeDetails from './components/RecipeDetails';
import Layout from './Layout';
import Spinner from './components/Spinner';
import './App.css';

const APP_ID = import.meta.env.VITE_APP_ID;
const APP_KEY = import.meta.env.VITE_APP_KEY;

const App = () => {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('Pizza');
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const recipesPerPage = 20;

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true); // Start loading
      const from = (currentPage - 1) * recipesPerPage;
      const to = from + recipesPerPage;
      const response = await fetch(
        `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=${from}&to=${to}`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setRecipes(data.hits);
      setTotalRecipes(data.count);
      setLoading(false); // Stop loading
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false); // Stop loading
    }
  }, [query, currentPage]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setQuery(search);
      setCurrentPage(1); // Reset to the first page when a new search is made
    }
  };

  const toggleFavorite = (recipe) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.some(fav => fav.uri === recipe.uri)) {
        return prevFavorites.filter(fav => fav.uri !== recipe.uri);
      } else {
        return [...prevFavorites, recipe];
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalRecipes / recipesPerPage);
    if (totalPages <= 1) return null; // No need for pagination if there's only one page

    const maxPageNumbers = 5;
    const startPage = Math.floor((currentPage - 1) / maxPageNumbers) * maxPageNumbers + 1;
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    const handleNext = () => {
      if (endPage < totalPages) {
        handlePageChange(endPage + 1);
      }
    };

    const handlePrevious = () => {
      if (startPage > 1) {
        handlePageChange(startPage - maxPageNumbers);
      }
    };

    return (
      <div className="pagination">
        {startPage > 1 && (
          <button className="page-button" onClick={handlePrevious}>
            Previous
          </button>
        )}
        {[...Array(endPage - startPage + 1)].map((_, i) => (
          <button 
            key={startPage + i} 
            className={`page-button ${currentPage === startPage + i ? 'active' : ''}`}
            onClick={() => handlePageChange(startPage + i)}
          >
            {startPage + i}
          </button>
        ))}
        {endPage < totalPages && (
          <button className="page-button" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout handleSubmit={handleSubmit} search={search} setSearch={setSearch} />}>
          <Route index element={
            <>
              {loading ? (
                <Spinner />
              ) : recipes.length === 0 ? (
                <div className="no-results">No Results Found!</div>
              ) : (
                <>
                  <motion.div className="recipes" layout>
                    {recipes.map((item) => (
                      <Link to={`/recipe/${encodeURIComponent(item.recipe.label)}`} key={item.recipe.uri} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card 
                          recipe={item.recipe} 
                          isFavorite={favorites.some(fav => fav.uri === item.recipe.uri)}
                          toggleFavorite={() => toggleFavorite(item.recipe)}
                        />
                      </Link>
                    ))}
                  </motion.div>
                  {renderPagination()}
                </>
              )}
            </>
          } />
          <Route path="/recipe/:name" element={<RecipeDetails recipes={recipes} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/favorites" element={
            <motion.div className="recipes" layout>
              {favorites.map((recipe) => (
                <Link to={`/recipe/${encodeURIComponent(recipe.label)}`} key={recipe.uri} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card 
                    recipe={recipe} 
                    isFavorite={true}
                    toggleFavorite={() => toggleFavorite(recipe)}
                  />
                </Link>
              ))}
            </motion.div>
          } />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
