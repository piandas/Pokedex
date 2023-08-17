import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent {

constructor(
  private pokemonService: PokemonService) { }

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
    // Aquí es donde enviarías la solicitud POST a tu API para agregar o eliminar el Pokémon de los favoritos
  }

}
