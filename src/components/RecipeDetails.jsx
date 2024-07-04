import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './RecipeDetails.module.css';

const RecipeDetails = ({ recipes }) => {
  const { name } = useParams();
  const recipe = recipes.find(item => item.recipe.label === decodeURIComponent(name))?.recipe;

  if (!recipe) return <div>Recipe not found</div>;

  return (
    <motion.div 
      className={styles.recipeDetails}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className={styles.backButton}>&larr; Back to recipes</Link>
      <h2>{recipe.label}</h2>
      <img src={recipe.image} alt={recipe.label} className={styles.image} />
      <div className={styles.ingredients}>
        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient.text}</li>
          ))}
        </ul>
      </div>
      <div className={styles.nutritionInfo}>
        <h3>Nutrition Information:</h3>
        <p>Calories: {Math.round(recipe.calories)}</p>
        <p>Protein: {Math.round(recipe.totalNutrients.PROCNT.quantity)}g</p>
        <p>Fat: {Math.round(recipe.totalNutrients.FAT.quantity)}g</p>
        <p>Carbs: {Math.round(recipe.totalNutrients.CHOCDF.quantity)}g</p>
      </div>
    </motion.div>
  );
};

export default RecipeDetails;