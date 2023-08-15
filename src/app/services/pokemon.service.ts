import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class PokemonService {
  constructor(private http: HttpClient) {}

  getPokemons(limit: number = 100): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  }

  getPokemonDetails(pokemonId: number | string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).pipe(
      catchError(error => {
        console.error('Error fetching Pokemon details:', error);
        return throwError(() => new Error('Error fetching Pokemon details'));
      })
    );
  }
}
