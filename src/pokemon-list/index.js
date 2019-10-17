import React, { Component} from 'react';
import './index.css';
import PokemonDetail from '../pokemon-detail';
import InfiniteScroll from "react-infinite-scroll-component";


class PokemonList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            pokemons: [],
            imagenes: [], 
            pokemon: {},
            hasMore: true
        }        
    }  
    
    getInitialData() {
        let data =  fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=30')
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

    getPokemonsInfo(data) {        
        data.then((result) => {
            result.map((item) => {
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
        });
    }

    componentWillMount() {        
        let data = this.getInitialData();
        this.getPokemonsInfo(data);
         
    }

    getExtraData(limit) {
        let url = 'https://pokeapi.co/api/v2/pokemon/?offset='+limit+'&limit=30';
        let data =  fetch(url)
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

    fetchMoreData = () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        if (this.state.pokemons.length <= 964) {
            setTimeout(() => {
                let dataExtra = this.getExtraData((this.state.pokemons.length+30));
                dataExtra.then((result) => {
                    result.map((item) => {
                        fetch(item.url)
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => { 
                            this.setState({
                                imagenes: this.state.imagenes.concat({"id": data.id, "name": data.name, "types": data.types, "abilities": data.abilities, "image": data.sprites.front_default, "url": item.url})
                            });                  
                        });   
                    });     
                });
                console.log('-------------------');
                console.log(this.state.imagenes);
            }, 1500);
        } else {
            this.setState({
                hasMore: false
            });  
        }
        
      };

    cargarPokemon(id, name, types, abilities, image) {
        this.setState({
            pokemon: {'id': id, 'name': name, 'types': types, 'abilities': abilities, 'image': image}
        })
    }    

    organizeData() {
        let order = this.state.imagenes.sort((a, b) => (a.id > b.id) ? 1 : -1);
        this.state.imagenes = order
    }
    
    render() {
        this.organizeData();
        return(
            <div className="row">
                <div className="col-md-6 Contenedor-list">
                    <div className="Component-container" id="scrollableDiv">
                        
                            <InfiniteScroll
                            dataLength={this.state.pokemons.length}
                            next={this.fetchMoreData}
                            hasMore={this.state.hasMore}
                            loader={<h4>Loading...</h4>}
                            endMessage={<h4>End.</h4>}
                            scrollableTarget="scrollableDiv"
                        >
                        <div className="row List">
                        {this.state.imagenes.map((item, index) =>
                            <div key={index} className="Pokemon-card" onClick={this.cargarPokemon.bind(this, item.id, item.name, item.types, item.abilities, item.image)}>
                                <img src={item.image} alt="item.name"/>
                            </div>
                        )}                            
                        </div>
                        </InfiniteScroll>
                        
                </div>
                </div>
                <div className="col-md-4 Contenedor-list">
                    <PokemonDetail pokemon={this.state.pokemon}/>
                </div>
            </div>
        )
    }
}

export default PokemonList