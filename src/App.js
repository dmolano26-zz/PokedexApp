import React from 'react';
import './App.css';
import PokemonList from './pokemon-list'

class App extends React.Component {
  /* Autor: Diego Molano
   * Fecha: Oct-2019
   * Descripcion: Componente principal
   */
  render() {
      return (
        <PokemonList/>
      )    
  }
}

export default App;
