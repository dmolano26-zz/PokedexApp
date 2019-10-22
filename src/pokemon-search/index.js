import React from 'react';
import './index.css';
class PokemonSearch extends React.Component {
    /* Autor: Diego Molano
     * Fecha: Oct-2019
     * Descripcion: Componente encargado de realizar las busquedas de Pokémons
     */
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
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de realizar el filtro según el input
         */
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
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de obtener la lista inicial
         *              que se usará para buscar los Pokémons
         * Entrada: N/A
         * Salida: data -> Objeto con la información del Promise obtenido al consumir la API
         */

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
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de entregar la información 
         *              filtrada según los criterios de búsqueda
         * Entrada: data -> Información obtenida de la API
         * Salida: state initialItems -> array con los nombres de los Pokémons
         */

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
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de obtener la información 
         *              del Pokémon seleccionado de la lista
         * Entrada: name -> Nombre del Pokémon escogido
         * Salida: json -> JSON con la información del Pokémon
         */

        let data =  await fetch('https://pokeapi.co/api/v2/pokemon/'+name)
        const json = await data.json();
        return json;
    }

    getPokemonInfo(data) {
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de entregar el objeto ya filtrado con la información
         *              necesaria para renderizar en el Detail
         * Entrada: data -> Información del Pokémon
         * Salida: pokemonInfo -> Objeto con la información necesaria del Pokémon
         */

        let pokemonInfo = data.then((result) => {   
            let info = {"id": result.id, "name": result.name, "types": result.types, "abilities": result.abilities, "image": result.sprites.front_default};   
            return info;
        });
        return pokemonInfo;
    }

    sendData(name) {        
        /* Autor: Diego Molano
         * Fecha: Oct-2019
         * Descripcion: Función encargada de enviar la información del Pokemon a renderizar, 
         *              al componente padre.
         * Entrada: name -> Nombre del Pokémon
         * Salida: props.pokemon -> Props actualizado con la información a renderizar
         */
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