const searchBtn = document.getElementById("search-button");
const inputField = document.getElementById("search-input");
const pokeInfo = document.getElementById("poke-info");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const weight = document.getElementById("weight");
const height = document.getElementById("height");
const moves = document.getElementById("moves");
const types = document.getElementById("types");
const hp = document.getElementById("hp");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const specialAttack = document.getElementById("special-attack");
const specialDefense = document.getElementById("special-defense");
const speed = document.getElementById("speed");

const colorObj = {
  'bug': '#a7b723',
  'dark': '#75574c',
  'dragon': '#7037ff',
  'electric': '#f9cf30',
  'fairy': '#e69eac',
  'fighting': '#c12239',
  'fire': '#f57d31',
  'flying': '#a891ec',
  'ghost': '#70559b',
  'normal': '#aaa67f',
  'grass': '#74cb48',
  'ground': '#dec16b',
  'ice': '#9ad6df',
  'poison': '#a43e9e',
  'psychic': '#fb5584',
  'rock': '#b69e31',
  'steel': '#b7b9d0',
  'water': '#6493eb'
}

function getPokemon(input) {
  //initial api fetch
  fetch("https://pokeapi-proxy.freecodecamp.rocks/api/pokemon")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
        let matchFound = false;

      for (let pokemon of data.results) {
        if (input == pokemon.name || input == pokemon.id) {
          //set flag to true
            matchFound = true;

          //begin fetch sequence
          fetch(pokemon.url)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              //consider refactoring into loop
              pokemonName.innerText = data.name.toUpperCase();
              pokemonId.innerText = `#${data.id}`;
              weight.innerText = data.weight;
              height.innerText = data.height;
              
              //remove previous types
              document.querySelectorAll("#types > p").forEach((p) => {
                p.remove();
              });
              //add new types
              for (let i = 0; i < data.types.length; i++) {
                types.appendChild(document.createElement("p"));
                let firstType = document.querySelector("#types > p:first-child");
                firstType.innerText = data.types[0].type.name.toUpperCase();
                firstType.style.backgroundColor = colorObj[data.types[0].type.name];
                if (data.types.length > 1) {
                let secondType = document.querySelector("#types > p:last-child");
                secondType.innerText = data.types[1].type.name.toUpperCase();
                secondType.style.backgroundColor = colorObj[data.types[1].type.name];
                document.getElementById('types').style.gridTemplateColumns = '1fr 1fr';
                } else {
                  document.getElementById('types').style.gridTemplateColumns = '1fr';
                }
              }

              //cool loop :)
              for (let stat of data.stats) {
                document.querySelectorAll("div p").forEach((p) => {
                  if (stat.stat.name == p.id) {
                    p.innerText = stat.base_stat;
                  }
                });
                document.querySelectorAll(".value-bar").forEach(bar => {
                  if (stat.stat.name == bar.dataset.label) {
                    bar.style.width = stat.base_stat / 2 + "%";
                    bar.style.backgroundColor = document.querySelector("#types > p:first-child").style.backgroundColor;
                  }
                });
              }
              //set sprite img src
              document.querySelector("img").src = data.sprites["front_default"];
              document.querySelector("img").style.display = "block";

              fetch(data.types[0].type.url)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json()
              })
              .then(data => {
                moves.innerHTML = '';
                moves.appendChild(document.createElement("p"));
                let firstMove = document.querySelector("#moves > p:first-child");
                firstMove.classList.add('poppins-light');
                firstMove.innerText = data.moves[0].name.replace('-', ' ');
                moves.appendChild(document.createElement("p"));
                let secondMove = document.querySelector("#moves > p:last-child");
                secondMove.classList.add('poppins-light');
                secondMove.innerText = data.moves[1].name.replace('-', ' ');
              })
            });

            break;
        }
      } 

      if (!matchFound) {
        alert("Pokémon not found");
      }

    })
    .catch((error) => {
        console.error("Error:", error);
      });
}

searchBtn.addEventListener("click", () => {
  getPokemon(inputField.value.trim().toLowerCase());
  inputField.value = "";
  inputField.blur();
});

inputField.addEventListener("keydown", (e) => {
  if (e.key == "Enter" || e.key == 13) {
    getPokemon(inputField.value.trim().toLowerCase());
    inputField.value = "";
    inputField.blur();
  }
});
