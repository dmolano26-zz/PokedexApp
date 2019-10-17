import React from 'react';
import './App.css';
import PokemonList from './pokemon-list'

class App extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = { pokemons: [] }
  }

  componentWillMount() {
    fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100')
      .then((response) => {
        return response.json()
      })
      .then((data) => {        
        this.setState({ pokemons: data.results })
      })
  }
  render() {
    if (this.state.pokemons.length > 0) {
      return (
        <PokemonList listado={this.state.pokemons} />
      )
    } else {
      return <p className="text-center">Cargando Pokemons...</p>
    }
    
  }
}

export default App;
