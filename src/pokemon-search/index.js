import React from 'react';
import './index.css';
class PokemonSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            pokemons: [],
            initialItems: [],
            items: [],
            pokemon: {}
        }        
    }  

    filterList = (event) => {
        if (event.target.value !== '') {
            let items = this.state.initialItems;
            items = items.filter((item) => {
                return item.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
            });
            this.setState({items: items});
        } else {
            this.setState({items: []});
        }
      
    }

    getData() {
        let data = fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1000')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            this.setState({
                pokemons: this.state.pokemons.concat(data.results)
            });
            return data.results;
        });
        return data;
    }

    getFilteredData(data) {        
        data.then((result) => {
            result.map((item) => {
                fetch(item.url)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {   
                    this.setState({
                        initialItems: [...this.state.initialItems, data.name]              
                    });                                        
                });   
            });     
        });
    }

    componentWillMount() { 
        let data = this.getData();
        this.getFilteredData(data); 
    }

    async getPokemonData(name) {        
        let data =  await fetch('https://pokeapi.co/api/v2/pokemon/'+name)
        const json = await data.json();
        return json;
    }

    getPokemonInfo(data) {
        let pokemonInfo = data.then((result) => {   
            let info = {"id": result.id, "name": result.name, "types": result.types, "abilities": result.abilities, "image": result.sprites.front_default};   
            return info;
        });
        return pokemonInfo;
    }

    sendData(name) {        
        let pokemonData = this.getPokemonData(name);        
        let pokemonDetail = this.getPokemonInfo(pokemonData);
        this.props.pokemon(pokemonDetail);        
    }

    render() {
      return (
        <div>
            <form>
                <input type="text" placeholder="Pokémon a buscar..." onChange={this.filterList}/>
            </form>
            
            {this.state.items.length > 0 ? (
                <div className="Search-container">
                    <ul>
                    {this.state.items.map((item, index) =>
                        <li key={index} onClick={this.sendData.bind(this, item)} className="Pokemon-pointer">{item}</li>
                    )}  
                    </ul>
                </div>
              ) : (
                    <div className="Empty-container">
                        <small id="Help" className="form-text text-muted">Ingrese el nombre del pokémon</small>
                    </div>
              )}
              
            
        </div>
      );
    }
}

export default PokemonSearch;