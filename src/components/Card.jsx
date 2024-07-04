import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import styles from './Card.module.css';

const Card = ({ recipe, isFavorite, toggleFavorite }) => {
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite();
  };

  return (
    <motion.div
      className={styles.recipe}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0px 8px 15px rgba(0,0,0,0.1)'
      }}
      transition={{ duration: 0.3 }}
    >
      <img src={recipe.image} alt={recipe.label} className={styles.image} />
      <h2 className={styles.title}>{recipe.label}</h2>
      <p className={styles.source}>Source: {recipe.source}</p>
      <button className={styles.favoriteButton} onClick={handleFavoriteClick}>
        <Heart fill={isFavorite ? "#ff6b6b" : "none"} color={isFavorite ? "#ff6b6b" : "#333"} />
      </button>
    </motion.div>
  );
};

export default Card;