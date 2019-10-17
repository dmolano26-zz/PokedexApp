import React, { Component } from 'react';
import './index.css';

class PokemonList extends Component {
    constructor(props) {
        super(props);
        this.state = { imagenes: [] }
    }

    componentWillMount() {
        this.props.listado.map((item, index) => {
            fetch(item.url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data.sprites.front_default);                   
            });   
        });
    }
    
    render() { 
        return(
            <div className="Component-container">
            </div>
        )
    }
}

export default PokemonList