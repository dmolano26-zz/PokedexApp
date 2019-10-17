import React from 'react';
import './index.css'

class PokemonDetail extends React.Component {
    
    render() {
        if (this.props.pokemon.id > 0) {
            
            return (
                <div className="Detail-container">
                    <div className="Pokemon-detail">
                        <div className="Detail-img">
                            <img key={this.props.pokemon.id} src={this.props.pokemon.image} className="imagen-pokemon" alt={this.props.pokemon.name}/>
                        </div>

                        <div className="Detail-body">
                            <h3><b>ID: </b>{this.props.pokemon.id}</h3>
                            <h3><b>Name: </b>{this.props.pokemon.name}</h3>
                            <h3><b>Types: </b></h3>
                            <ul>
                            {this.props.pokemon.types.map((type, i) => {               
                                // Return the element. Also pass key     
                                return (<li key={i}>{type.type.name}</li>) 
                            })}
                            </ul>
                            <h3><b>Abilities: </b></h3>
                            <ul>
                            {this.props.pokemon.abilities.map((ability, i) => {               
                                // Return the element. Also pass key     
                                return (<li key={i}>{ability.ability.name}</li>) 
                            })}
                            </ul>
                        </div>
                    </div>
                </div>
            )
        } else {
            return <p className="text-center">Escoja un pokemon.</p>
        }
    }

}

export default PokemonDetail;