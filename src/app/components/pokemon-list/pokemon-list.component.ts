import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, switchMap, Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent {

private favoritesSubscription!: Subscription; // Suscripción para escuchar cambios en los favoritos

constructor(private pokemonService: PokemonService) { }

  pokemons: any[] = [];
  selectedPokemon: any = null;

  ngOnInit(): void {
    this.pokemonService.getPokemons().pipe(
      map((response: any) => response.results),
      catchError((error) => {
        console.error('Error fetching pokemons:', error);
        return [];
      }),
      switchMap((pokemons: any[]) => {
        const detailsObservables = pokemons.map(pokemon => this.pokemonService.getPokemonDetails(pokemon.name));
        return forkJoin(detailsObservables);
      })
      ).subscribe((pokemonsDetails: any[]) => {
        this.pokemons = pokemonsDetails;
        // Después de obtener los detalles, obtén la lista de favoritos
        this.pokemonService.getFavoritePokemons().subscribe(favoritePokemons => {
            this.pokemons.forEach(pokemon => {
                pokemon.isFavorite = favoritePokemons.includes(pokemon.name);
            });
        });
      });
      this.pokemonService.getFavoritePokemons().subscribe(favoritePokemons => {
        this.pokemons.forEach(pokemon => {
          if (favoritePokemons.includes(pokemon.name)) {
              pokemon.isFavorite = true;
          }
      });
    });
      this.favoritesSubscription = this.pokemonService.favoritesChanged.subscribe(() => {
        this.updateFavoriteStatus();
    });
  }

  ngOnDestroy(): void {
    // Cancela la suscripción al destruir el componente
    this.favoritesSubscription.unsubscribe();
  }

  updateFavoriteStatus() {
    this.pokemonService.getFavoritePokemons().subscribe(favoritePokemons => {
      this.pokemons.forEach(pokemon => {
        pokemon.isFavorite = favoritePokemons.includes(pokemon.name);
      });
    });
  }

  onPokemonSelected(pokemon: any): void {
    if (this.selectedPokemon === pokemon) {
      // Si el Pokémon seleccionado es clickeado nuevamente, cierra el desplegable.
      this.selectedPokemon = null;
    } else {
      // Si se selecciona un Pokémon diferente, muestra sus detalles.
      this.selectedPokemon = pokemon;
    }
  }

  toggleFavorite(pokemon: any): void {
    pokemon.isFavorite = !pokemon.isFavorite;
    if (pokemon.isFavorite) {
        this.pokemonService.addPokemonToFavorites(pokemon.name).subscribe(response => {
            console.log(response.message);
        });
    } else {
        this.pokemonService.removePokemonFromFavorites(pokemon.name).subscribe(response => {
            console.log(response.message);
        });
    }
  }
  // Aquí puedes agregar lógica adicional para eliminar el Pokémon de favoritos si es necesari
}
