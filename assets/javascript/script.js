//import * as color from './tema.js';
//import {buscar} from './buscar';


        // definim com a carta el element div plantilla de la plana html on afegirem el conjunt d'elements creats
const carta = document.getElementById('plantilla');

        // definim els colors de fons dels pokemons segons el seu tipus
const colorsFons = { fire: 'rgb(255,99,71)', grass: 'rgb(0,255,0)', electric: 'rgb(123,104,238)',
    water: 'rgb(0,255,255)', ground: 'rgb(205,133,63)', rock: 'rgb(192,192,192)', fairy: 'rgb(238,130,238)',
    poison: 'rgb(154,205,50)', bug: 'rgb(189,183,107)', dragon: 'rgb(255,165,0)', psychic: 'rgb(255,182,193)',
    flying: 'rgb(173,216,230)', fighting: 'rgb(255,215,0)', normal: 'rgb(240,280,140)',
    undefined: 'rgb(255, 255, 255)'
}

        // passem els colors de fons segons el tipus a tipusGeneral
const tipusGeneral = Object.keys(colorsFons);

        // passem el link back a variable per ocultar inicialment i també el text d'avís (paràmetres url)
const tornar = document.querySelector('.imgdreta');
const noURL = document.querySelector('.senseUrl');
const bID = document.querySelector('.buscID');

        // en carregar la plana, demanem el prompt per invocar pokemons, inicialitzem els option i ocultem paràmetres URL
window.addEventListener("load", () => {
  tornar.style.display = "none";
  noURL.style.display = "none";
  bID.style.display = "none";
  invocarPokemons();
});

        // demanem el número de pokemons a invocar i verifiquem que sigui un número entre 1 i 10
function demanaPoks(){
  numeroPoks = +prompt('Introdueix quants Pokemons vols invocar (màx. 10)');
        // comprovem que es demanen números entre 1 i 10 (+prompt ja assegura que sigui numèric)
  if (! ((numeroPoks > 0) && (numeroPoks < 11))) {
    alert('No és un número correcte o està per sota de 1 o per sobre de 10')
    demanaPoks()
  }
}

        // aqui agafem el número de pokemons que volem de numeroPoks i o enviem a ferConsulta
const invocarPokemons = async () => {
  demanaPoks();
  for (let i=1; i <= numeroPoks; i++) {
      await ferConsulta(i)
  }
}

        // funció per obtenir un número aleatori per buscar pokemons a l'atzar
function numAleatori(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

        // fem la consulta api de pokemons tants cops com ens indica (i) de invocarPokemons
        // sense async i wait no funciona correctament
const ferConsulta = async () => {
        // cada volta que fem escollim un número diferent de pokemon
pokemonID = numAleatori(1, 1000);
const url = `https://pokeapi.co/api/v2/pokemon/${pokemonID}`;
const resposta = await fetch(url);
const dades = await resposta.json();
cartaPokemon(dades);
}

const cartaPokemon = (pokemon) => {
        // aqui definim quin element crearem per representar la info del pokemon
  const elementPokemon = document.createElement('div');
  elementPokemon.classList.add('pokemon');
        // agafem el name, convertim la 1era lletra en majuscula i el passem a nomPok
  const nomPok = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
        // agafem el id i el passem a idPok
  const idPok = pokemon.id;
        // passem les dades de la api a un array map per extreure els tipus de pokemon
  const tipus = pokemon.types.map(type => type.type.name);
        // enviem a tipusPok el tipus de pokemon que és segons la comparació del array tipusGeneral i tipus
  const tipusPok = tipusGeneral.find(type => tipus.indexOf(type) > -1);
        // passem les dades de la api d'atac i defensa
  const atacDefensa = pokemon.stats.map(stat => stat.base_stat);
        // passem a la variable corresponent el número d'atac i defensa
  const atac = atacDefensa[1];
  const defensa = atacDefensa[2];

        // segons el tipus de pokemon tipusPok li assignem un color de la llista colorsFons pel backgroundColor
  const color = colorsFons[tipusPok];
  
        // aqui montem el div amb els tags del contingut extret de la consulta fetch
  const pokemonInnerHTML = `
    <div class="davant">
      <p class="numID">ID: ${idPok}</p>
      <p class="nameP">${nomPok}</p>
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png">
      <br><small class="tipusP">Tipus Pokemon: <span>${tipusPok}</span></small>
    </div>
    <div class="darrera">
      <br><p class="atacP">Atac - ${atac}</p>
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemon.id}.png">
      <p class="defensaP">Defensa - ${defensa}</p>
    </div>
  `;

        // ja sabem quin color hem assignat al pokemon segons el tipus i l'enviem a l'element
  elementPokemon.style.backgroundColor = color;
        // amb els tags html a mostrar per cada pokemon montem el conjunt
  elementPokemon.innerHTML = pokemonInnerHTML;
        // tenim el conjunt montat i ho enviem a carta per tal que ho representi on toca del document
  carta.appendChild(elementPokemon);
}

//secció de funcions pel canvi de tema clar-fosc

        // capturem la caixa de cartes dels pokemon per donar color segons el tema
const boxCartes = document.getElementById('plantilla');

        //llegim localstorage per saber si tenim un tema escollit d'abans
let temaColor = window.localStorage.getItem('tema');
if (temaColor) {
  selecTema(temaColor);
  actRadio(temaColor);
}

        // capturem els radiobutons en un llistat i si detecta canvis va a selecTema
const radButons=document.querySelectorAll('input[name="tema"]');

radButons.forEach(x => {
    x.addEventListener('change', function() {
      selecTema(this.value)
    })
});

        //si no, escollim tema i guardem en localstorage
function selecTema(temcf) {
  switch (temcf) {
    case 'fosc':
      boxCartes.style.backgroundColor = 'rgb(52, 73, 94)';
      document.querySelector('body').style.backgroundColor = "rgb(40, 55, 71)";
      window.localStorage.setItem('tema', 'fosc');
      break;
  
    case 'clar':
      boxCartes.style.backgroundColor = 'rgb(250,235,215)';
      document.querySelector('body').style.backgroundColor = "rgb(250,240,230)";
      window.localStorage.setItem('tema', 'clar');
    default:
      break;
  }
}

        //aqui controlem quin radio està seleccionat i el canviem si cal
function actRadio(value) {
  switch (value) {
    case 'fosc':
      document.getElementById('rfosc').checked=true;
      document.getElementById('rclar').checked=false;
      break;
    case 'clar':
      document.getElementById('rclar').checked=true;
      document.getElementById('rfosc').checked=false;
    break;
  
    default:
      document.getElementById('rfosc').checked=true;
      document.getElementById('rclar').checked=false;
      break;
  }
}
// final secció de funcions pel canvi de tema clar-fosc

// secció buscar per input search

        // capturem la tecla que marquem al buscar (keyup)
document.addEventListener("keyup", buscar =>{
          // si la tecla coincideix (*)
  if (buscar.target.matches(".buscarInput")){
      // si la tecla que tenim és (Esc) buidem el input i tornem enrerra
    if (buscar.key ==="Escape")buscar.target.value = ""
              // (*) amb el nom dins de cada pokemon
    document.querySelectorAll(".pokemon").forEach(nom => {
          // fem la comparació amb minuscules per facilitar - si és si (?) no l'ocultem - si és no (:) l'ocultem
      nom.textContent.toLowerCase().includes(buscar.target.value.toLowerCase())
        ?nom.classList.remove('filtreBusc')
        :nom.classList.add("filtreBusc")
  })}
})

// final secció buscar per input search

/* secció paràmetres url

        // capturem els pokemon dins de cartesPok
const cartesPok = document.querySelectorAll('.pokemon');
let parametresID = new URLSearchParams(document.location.search);
let urlID = parametresID.get("ID");

bID.addEventListener('click', function() {
  let nID = +prompt('Introdueix nou ID');

  if (nID) {
      // modificar el text del missatge
    noURL.style.display = "block";
    noURL.innerHTML = `El paràmetre de la url és <strong>${urlID}</strong>`;
      // mostrar l'enllaç per tornar enrera
    bID.style.display = "none";
    tornar.style.display = "block";
      // mostrar els pokemons només quan estem a la pàgina o ruta inicial (sense paràmetres a la url)
    cartesPok.forEach( link => link.style.display = "none" );
  } else {
      // modificar el text del missatge
    noURL.innerHTML = `Sense paràmetres a la URL`;
    tornar.style.display = "none";
      // mostrar els pokemons només quan estem a la pàgina o ruta inicial (sense paràmetres a la url)
    cartesPok.forEach( link => link.style.display = "block" );
  }
})

final secció paràmetres url*/

// fem la crida a les funcions dels altres fitxers js on toqui segons el flux del codi
//color();
//buscar();