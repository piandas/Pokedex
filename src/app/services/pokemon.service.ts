import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of, Subject, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class PokemonService {

  private baseURL = 'https://pokeapi.co/api/v2';
  public favoritesChanged = new Subject<void>();

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

  addPokemonToFavorites(pokemonName: string): Observable<any> {
    return this.http.post('http://localhost:3000/favorites', { name: pokemonName }).pipe(
      catchError(error => {
        console.error('Error adding Pokemon to favorites:', error);
        return throwError(() => new Error('Error adding Pokemon to favorites'));
      }),
      tap(() => this.favoritesChanged.next()) // Emite el evento cuando se agrega un favorito
    );
  }

  removePokemonFromFavorites(pokemonName: string): Observable<any> {
    return this.http.delete('http://localhost:3000/favorites', { body: { name: pokemonName } }).pipe(
      catchError(error => {
        console.error('Error removing Pokemon from favorites:', error);
        return throwError(() => new Error('Error removing Pokemon from favorites'));
      }),
      tap(() => this.favoritesChanged.next()) // Emite el evento cuando se elimina un favorito
    );
  }

  getFavoritePokemons(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/favorites');
  }

}
