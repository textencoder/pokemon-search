const searchBtn = document.getElementById('search-button');
const inputField = document.getElementById('search-input');
const pokeInfo = document.getElementById('poke-info');
const pokemonName = document.getElementById('pokemon-name')
const pokemonId = document.getElementById('pokemon-id')
const weight = document.getElementById('weight')
const height = document.getElementById('height')
const types = document.getElementById('types')
const hp = document.getElementById('hp')
const attack = document.getElementById('attack')
const specialAttack = document.getElementById('special-attack')
const specialDefense = document.getElementById('special-defense')
const speed = document.getElementById('speed')

//console scripting fun
// document.querySelectorAll('div p').forEach(p => {
//     console.log(`const ${p.id} = document.getElementById('${p.id}')`);
// })

function getPokemon(input) {
    fetch('https://pokeapi-proxy.freecodecamp.rocks/api/pokemon')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json();
    })
    .then (data => {
        for (let pokemon of data.results) {
            if (input == pokemon.name) {
                fetch(pokemon.url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data.sprites);
                    //consider refactoring into loop
                    pokemonName.innerText = data.name.toUpperCase();
                    pokemonId.innerText = data.id;
                    weight.innerText = data.weight;
                    height.innerText = data.height;
                    //needs loop for multiple types
                    types.innerText = data.types[0].type.name.toUpperCase();
                    //cool loop :)
                    for (let stat of data.stats) {
                        document.querySelectorAll('div p').forEach(p => {
                            if (stat.stat.name == p.id) {
                                p.innerText = stat.base_stat;
                            }
                        })
                    }
                })
            }
        }
    }
    )
    
}

getPokemon();

searchBtn.addEventListener('click', () => {
    getPokemon(inputField.value);
    inputField.value = '';
})

inputField.addEventListener('keydown', e => {
    if (e.key == 'Enter' || e.key == 13) {
        getPokemon(inputField.value);
        inputField.value = '';
    }
})