import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of  } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class PokemonService {

  private baseURL = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemons(limit: number = 100): Observable<any> {
    return this.http.get(`${this.baseURL}/pokemon?limit=${limit}`);
  }

  getPokemonDetails(pokemonId: number | string): Observable<any> {
    return this.http.get(`${this.baseURL}/pokemon/${pokemonId}`).pipe(
      catchError(error => {
        console.error('Error fetching Pokemon details:', error);
        return throwError(() => new Error('Error fetching Pokemon details'));
      })
    );
  }

  addPokemonToFavorites(pokemon: any): Observable<any> {
    // Aquí es donde enviarías la solicitud POST a tu API
    // Por ahora, solo devolvemos un observable vacío
    return of(null);
  }

}
