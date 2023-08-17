const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());



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
