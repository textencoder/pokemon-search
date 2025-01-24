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

//console scripting fun
// document.querySelectorAll('div p').forEach(p => {
//     console.log(`const ${p.id} = document.getElementById('${p.id}')`);
// })

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
                document.querySelector("#types > p:first-child").innerText =
                  data.types[0].type.name.toUpperCase();
                if (data.types.length > 1) {
                  document.querySelector("#types > p:last-child").innerText =
                    data.types[1].type.name.toUpperCase();
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
                  }
                });
              }
              //set sprite img src
              document.querySelector("img").src = data.sprites["front_default"];
              document.querySelector("img").style.display = "block";
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
});

inputField.addEventListener("keydown", (e) => {
  if (e.key == "Enter" || e.key == 13) {
    getPokemon(inputField.value.trim().toLowerCase());
    inputField.value = "";
  }
});
