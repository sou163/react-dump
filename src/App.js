import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // traditional approach
  // const fetchMoviesHandler = () => {
  //   setIsLoading(true);
  //   setError(null);
  //   fetch("https://swapi.dev/api/films/")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("An error occurred!");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       const transformedData = data.results.map((movieData) => {
  //         return {
  //           id: movieData["episode_id"],
  //           title: movieData["title"],
  //           openingText: movieData["opening_crawl"],
  //           releaseDate: movieData["release_date"]
  //         };
  //       });
  //       setMovieList(transformedData);
  //       setIsLoading(false);
  //     }).catch(error => setError(error.message));
  // };

  // conventional approach
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-practice-c8d03-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error("An error occurred!");
      }

      const data = await response.json();

      const transformedData = data.results.map((movieData) => {
        return {
          id: movieData["episode_id"],
          title: movieData["title"],
          openingText: movieData["opening_crawl"],
          releaseDate: movieData["release_date"]
        };
      });
      setMovieList(transformedData);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content;

  if (movieList.length > 0) {
    content = <MoviesList movies={movieList} />;
  } else if (error) {
    content = <p>{error}</p>;
  } else if (isLoading) {
    content = <p>Loading...</p>;
  } else {
    content = <p>Found No Movies!</p>;
  }

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-practice-c8d03-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const data = await response.json();
    console.log(data);
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
