import React, { Component } from 'react';
import './index.css';
import PokemonDetail from '../pokemon-detail';

class PokemonList extends Component {
    constructor(props) {
        super(props);
        this.state = { imagenes: [], pokemon: {} }
    }

    cargarPokemon(id, name, types, abilities, image) {
        this.setState({
            pokemon: {'id': id, 'name': name, 'types': types, 'abilities': abilities, 'image': image}
        })
    }
    componentWillMount() {
        this.props.listado.map((item, index) => {
            fetch(item.url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {   
                this.setState(prevState => ({
                    imagenes: [...prevState.imagenes, {"id": data.id, "name": data.name, "types": data.types, "abilities": data.abilities, "image": data.sprites.front_default, "url": item.url}]
                  }))
                                   
            });   
        });

        
    }

    organizeData() {
        let order = this.state.imagenes.sort((a, b) => (a.id > b.id) ? 1 : -1);
        this.state.imagenes = order
    }
    
    render() {
        this.organizeData();
        return(
            <div className="row container">
                <div className="col-md-8 App-container">
                    <div className="Component-container">
                        <div className="row List">
                            {this.state.imagenes.map((item, index) => 
                                <div key={index} className="Pokemon-card" onClick={this.cargarPokemon.bind(this, item.id, item.name, item.types, item.abilities, item.image)}>
                                    <img src={item.image} alt="item.name"/>
                                </div>
                            )}
                        </div>
                </div>
                </div>
                <div className="col-md-4">
                    <PokemonDetail pokemon={this.state.pokemon}/>
                </div>
            </div>
        )
    }
}

export default PokemonList