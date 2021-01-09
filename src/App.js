import React, { useState, useEffect } from "react";
import axios from "axios";

export default () => {
  const [pokemonName, setPokemonName] = useState("pikachu");
  const [pokemonImgUrl, setPokemonImgUrl] = useState(
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  );
  const [debouncedPokemonName, setDebouncedPokemonName] = useState(pokemonName);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedPokemonName(pokemonName);
    }, 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, [pokemonName]);

  useEffect(() => {
    const search = async () => {
      if (debouncedPokemonName) {
        setPokemonImgUrl("");
        try {
          setHasError(false);
          const { data } = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${debouncedPokemonName}/`
          );
          setPokemonImgUrl(data.sprites.front_default);
        } catch (e) {
          setHasError(true);
        }
      }
    };
    search();
  }, [debouncedPokemonName]);

  const onInputChange = (event) => {
    setPokemonName(event.target.value);
  };

  const renderResult = () => {
    if (!hasError && pokemonImgUrl) {
      return (
        <div>
          <img src={pokemonImgUrl} alt={debouncedPokemonName}></img>
        </div>
      );
    } else if (!hasError && pokemonImgUrl === "") {
      return <div>Please wait</div>;
    } else if (hasError) {
      return <div>Whoops, something went wrong. please try again!</div>;
    }
  };

  return (
    <div>
      <label htmlFor="name-input">Search for Pokemon</label>
      <input id="name-input" onChange={onInputChange} value={pokemonName} />
      {renderResult()}
    </div>
  );
};
