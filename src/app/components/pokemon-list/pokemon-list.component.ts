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


}
