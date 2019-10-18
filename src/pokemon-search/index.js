import React from 'react';
import './index.css';
class PokemonSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            pokemons: [],
            initialItems: [],
            items: []
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
        let data =  fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1000')
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

    render() {
      return (
        <div>
            <form>
                <input type="text" placeholder="Search" onChange={this.filterList}/>
            </form>
            
            {this.state.items.length > 0 ? (
                <div className="Search-container">
                    {this.state.items.map((item, index) =>
                        <p key={index}>{item}</p>
                    )}  
                </div>
              ) : (
                <small id="Help" class="form-text text-muted">Ingrese el nombre del pokémon</small>
              )}
              
            
        </div>
      );
    }
}

export default PokemonSearch;