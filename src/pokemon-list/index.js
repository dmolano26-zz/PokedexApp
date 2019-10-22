import React, { Component} from 'react';
import './index.css';
import PokemonDetail from '../pokemon-detail';
import InfiniteScroll from "react-infinite-scroll-component";
import PokemonSearch from '../pokemon-search';


class PokemonList extends Component {
    /* Autor: Diego Molano
     * Fecha: Oct-2019
     * Descripcion: Componente encargado de renderizar la lista
     *              de todos los pokemones, usando Infinity Scroll
     */

    constructor(props) {
        super(props);
        this.state = { 
            pokemons: [],
            dataFiltered: [], 
            pokemon: {},
            hasMore: true
        }        
    }  
    
    getInitialData() {
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de obtener la lista inicial
         *              que se renderizará, siendo esta de los 30 primeros 
         *              Pokémons
         */

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
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de mapear la información obtenida y filtrar
         *              los campos que se utilizarán
         * Entrada: data -> Promise obtenido del consumo inicial de la API con la función getInitialData
         * Salida:  State dataFiltered -> Objeto que contiene la información filtrada para usar.
         */

        data.then((result) => {
            result.map((item) => {
                fetch(item.url)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {   
                    this.setState(prevState => ({
                        dataFiltered: [...prevState.dataFiltered, {"id": data.id, "name": data.name, "types": data.types, "abilities": data.abilities, "image": data.sprites.front_default, "url": item.url}]
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
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de obtener el resto de la información, cada
         *              vez que se realiza scroll a la parte final de la pantalla.
         *              Se añaden 30 Pokémons adicional cada vez que se llega al final.
         * Entrada: limit -> Limite usado para el consumo de la API
         * Salida: data -> Objeto con el result del Promise obtenido al consumir la API
         */

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
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de solicitar más información a la API
         *              cuando se llega al final de la pantalla.
         */
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
                                dataFiltered: this.state.dataFiltered.concat({"id": data.id, "name": data.name, "types": data.types, "abilities": data.abilities, "image": data.sprites.front_default, "url": item.url})
                            });                  
                        });   
                    });     
                });
            }, 1500);
        } else {
            this.setState({
                hasMore: false
            });  
        }        
      };

    cargarPokemon(id, name, types, abilities, image) {
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de cargar el Pokémon que se renderizará en el Detail
         * Entrada: id -> id del Pokémon obtenido de la API
         *          name -> nombre del Pokémon obtenido de la API
         *          types -> array con los elementos del Pokémon obtenidos de la API
         *          abilities -> array con las abilidades del Pokémon obtenidoas de la API
         *          image -> URL con la imagen a usar en el renderizado
         * Salida: state pokemon -> Objeto con la información necesaria para el renderizado del Detail
         */
        this.setState({
            pokemon: {'id': id, 'name': name, 'types': types, 'abilities': abilities, 'image': image}
        })
    }    

    organizeData() {
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de ordenar la lista de los Pokémons por su ID
         */
        let order = this.state.dataFiltered.sort((a, b) => (a.id > b.id) ? 1 : -1);
        this.state.dataFiltered = order
    }

    callbackFunction = (childData) => {     
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de obtener la información de la barra de busqueda para renderizár el 
         *              Pokémon seleccionado
         */   
        childData.then((data) => {
            this.setState({
                pokemon: {'id': data.id, 'name': data.name, 'types': data.types, 'abilities': data.abilities, 'image': data.image}
            });
        });        
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
                                {this.state.dataFiltered.map((item, index) =>
                                    <div key={index} className="Pokemon-card" onClick={this.cargarPokemon.bind(this, item.id, item.name, item.types, item.abilities, item.image)}>
                                        <img src={item.image} alt="item.name"/>
                                    </div>
                                )}                            
                            </div>
                        </InfiniteScroll>                        
                </div>
                </div>
                <div className="col-md-4 Contenedor-list">
                    <div className="row">
                        <PokemonSearch pokemon={this.callbackFunction}/>
                        <PokemonDetail pokemon={this.state.pokemon}/>
                    </div>                    
                </div>
            </div>
        )
    }
}

export default PokemonList