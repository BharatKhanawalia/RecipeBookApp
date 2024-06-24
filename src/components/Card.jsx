import Styles from "./Card.module.css";

const Card = (props) => {
  console.log(props.recipe.recipe, "com");
  return (
    <div className={Styles.recipe}>
      <h2>{props.recipe.recipe.label}</h2>
      <img src={props.recipe.recipe.image} className={Styles.image} />
    </div>
  );
};

export default Card;
