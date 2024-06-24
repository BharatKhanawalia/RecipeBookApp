import { useState, useEffect } from "react";
import Card from "./components/Card";
import "./App.css";

const App = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("Pizza");
  const [recipes, setRecipes] = useState([]);
  const APP_ID = "dc34792b";
  const APP_KEY = "3eab1a651f78f58e8b394f905f3efa21";
  useEffect(() => {
    fetch(
      `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setRecipes(data.hits));
  }, [query]);

  const submitHanlder = () => {
    setQuery(search);
    setSearch("");
  };

  return (
    <div className="App">
      <div className="search-form">
        <input
          type="text"
          className="search-bar"
          placeholder="Enter Your Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="button" onClick={submitHanlder} className="search-button">
          Submit
        </button>
      </div>
      <div className="recipes">
        {recipes.map((item) => {
          return <Card recipe={item} />;
        })}
      </div>
    </div>
  );
};
export default App;
