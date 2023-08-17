const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  methods: ['GET', 'POST', 'DELETE']
}));



// Lista de Pokémon favoritos (solo para demostración, en un caso real usarías una base de datos)
const favoritePokemons = [];

app.post('/favorites', (req, res) => {
  const pokemonName = req.body.name;
  if (!favoritePokemons.includes(pokemonName)) {
      favoritePokemons.push(pokemonName);
  }
  res.status(201).send({ message: 'Pokémon añadido a favoritos' });
});

app.get('/favorites', (req, res) => {
    res.send(favoritePokemons);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/favorites`);
});

app.delete('/favorites', (req, res) => {
  const pokemonName = req.body.name;
  const index = favoritePokemons.indexOf(pokemonName);
  if (index > -1) {
      favoritePokemons.splice(index, 1);
      res.status(200).send({ message: 'Pokémon eliminado de favoritos' });
  } else {
      res.status(404).send({ message: 'Pokémon no encontrado en favoritos' });
  }
});

app.delete('/favorites/all', (req, res) => {
  favoritePokemons.length = 0; // Vacía el array de favoritos
  res.status(200).send({ message: 'Todos los Pokémon han sido eliminados de favoritos' });
});
