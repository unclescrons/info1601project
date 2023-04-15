// Function to draw a card for a Pokemon
function drawCard(pokemon) {
  fetch(pokemon.url)
    .then(response => response.json())
    .then(pokemonData => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${pokemonData.sprites.other['official-artwork'].front_default}">
        <div class="card-name">${pokemonData.name}</div>
        <button class="card-button">Detail</button>
        <div class="card-details">
          <p>Details for ${pokemonData.name}</p>
          <p>Identifier: ${pokemonData.id}</p>
          <p>Base Experience: ${pokemonData.base_experience}</p>
          <p>Height: ${pokemonData.height} dm</p>
          <p>Weight: ${pokemonData.weight} hg</p>
          <p>Abilities: ${pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
          <p>Moves: ${pokemonData.moves.map(move => move.move.name).join(', ')}</p>
          <p>Forms: ${pokemonData.forms.map(form => form.name).join(', ')}</p>
          <p>Types: ${pokemonData.types.map(type => type.type.name).join(', ')}</p>
          <p>Species: ${pokemonData.species.name}</p>
        </div>
      `;


      const detailButton = card.querySelector('.card-button');
      const cardDetails = card.querySelector('.card-details');
      detailButton.addEventListener('click', (event) => {
        // Toggle visibility of card details
        cardDetails.style.display = cardDetails.style.display === 'none' ? 'block' : 'none';
      });

      // Append card to card container
      const cardContainer = document.getElementById('card-container');
      cardContainer.appendChild(card);
    })
    .catch(error => console.error(error));
}

// Fetch Pokemon data
fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
  .then(response => response.json())
  .then(data => {
    // Loop through each Pokemon and create a card for it
    for (const pokemon of data.results) {
      drawCard(pokemon);
    }
  })
  .catch(error => console.error(error));

// Get DOM elements
const sortBtn = document.getElementById("filterBtn");
const searchBarContainer = document.getElementById("searchBarContainer");
const searchBar = document.getElementById("searchBar");
const searchBtn = document.getElementById("searchBtn");
const pokemonContainer = document.getElementById("card-container");

// Add event listener for sort button click
sortBtn.addEventListener("click", function() {
    // Show the search bar container
    searchBarContainer.style.display = "block";
});

// Add event listener for search button click
searchBtn.addEventListener("click", function() {
    // Get the search query
    const searchQuery = searchBar.value.toLowerCase();
    
    // Fetch Pokemon data based on search query
    fetch(`https://pokeapi.co/api/v2/type/${searchQuery}`)
        .then(response => response.json())
        .then(data => {
    
            pokemonContainer.innerHTML = "";
            
            // Loop through the Pokemon data
            data.pokemon.forEach(function(pokemon) {
                const card = document.createElement("div");
                card.classList.add("pokemonCard");

                const name = document.createElement("h2");
                name.textContent = pokemon.pokemon.name;
                card.appendChild(name);

                const image = document.createElement("img");
                fetch(pokemon.pokemon.url)
                    .then(response => response.json())
                    .then(data => {
                        image.src = data.sprites.front_default;
                    })
                    .catch(error => {
                        console.error("Error fetching Pokemon details:", error);
                    });
                card.appendChild(image);

                pokemonContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching Pokemon data:", error);
        });
});

// Add event listener for search button click
searchBtn.addEventListener("click", function() {
    // Get the search query
    const searchQuery = searchBar.value.toLowerCase();
    
    // Fetch Pokemon data based on search query
    fetch(`https://pokeapi.co/api/v2/type/${searchQuery}`)
        .then(response => response.json())
        .then(data => {
            // Clear the current pokemon container
            pokemonContainer.innerHTML = "";
            
            // Loop through the Pokemon data
            data.pokemon.forEach(function(pokemon) {
                // Call the drawCard function to create a card for the Pokemon
                drawCard(pokemon.pokemon);
            });
        })
        .catch(error => {
            console.error("Error fetching Pokemon data:", error);
        });
});


// Slideshow functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const slideInterval = setInterval(nextSlide, 2500);

// Fetch 5 random Pokemon from PokeAPI
fetch('https://pokeapi.co/api/v2/pokemon?limit=5')
    .then(response => response.json())
    .then(data => {
        const pokemonList = data.results;

        // Display Pokemon data on slide
        slides.forEach((slide, index) => {
            const randomPokemon = pokemonList[index]; // Fetch Pokemon based on slide index
            displayPokemon(randomPokemon, index);
        });
    })
    .catch(error => console.error(error));

// Display Pokemon data on slide
function displayPokemon(pokemon, index) {
    const pokemonImage = slides[index].querySelector('.pokemonImage');
    const pokemonName = slides[index].querySelector('.pokemonName');
    const pokemonButton = slides[index].querySelector('.pokemonButton');

    pokemonImage.src = '';
    pokemonName.textContent = 'Loading...';
    pokemonButton.href = '';

    // Fetch Pokemon details from PokeAPI
    fetch(pokemon.url)
        .then(response => response.json())
        .then(data => {
            pokemonImage.src = data.sprites.front_default;
            pokemonName.textContent = data.name;
            pokemonButton.href = `#`;
        })
        .catch(error => console.error(error));
}

// Initial display
slides[currentSlide].classList.add('active');

// Slideshow navigation
const prevButton = document.querySelector('.prev-btn');
const nextButton = document.querySelector('.next-btn');


prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

function prevSlide() {
    clearInterval(slideInterval);
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    slideInterval = setInterval(nextSlide, 2500);
}

function nextSlide() {
    clearInterval(slideInterval);
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    let nextSlideIndex = (currentSlide + 1) % slides.length;
    slides[nextSlideIndex].classList.add('active');
    dots[nextSlideIndex].classList.add('active');
    currentSlide = nextSlideIndex;
    slideInterval = setInterval(nextSlide, 2500);
}



// Slideshow indicators (dots) functionality
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        slideInterval = setInterval(nextSlide, 2500);
    });
});
