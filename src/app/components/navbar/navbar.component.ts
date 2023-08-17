import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Subscription } from 'rxjs'; // Importa Subscription

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showFavoritesDropdown = false;
  favoritePokemons: string[] = [];
  private favoritesSubscription!: Subscription;

  constructor(private pokemonService: PokemonService) {} // Inyecta el servicio

  ngOnInit(): void {
    this.fetchFavoritePokemons();
    // Suscríbete al evento de cambios en los favoritos
    this.favoritesSubscription = this.pokemonService.favoritesChanged.subscribe(() => {
      this.fetchFavoritePokemons();
    });
  }

  ngOnDestroy(): void {
    // Cancela la suscripción al destruir el componente
    this.favoritesSubscription.unsubscribe();
  }

  toggleFavoritesDropdown() {
    this.showFavoritesDropdown = !this.showFavoritesDropdown;
    // Si prefieres obtener la lista cada vez que se haga clic en el botón, descomenta la siguiente línea:
    // this.fetchFavoritePokemons();
  }

  fetchFavoritePokemons() {
    this.pokemonService.getFavoritePokemons().subscribe(favorites => {
      this.favoritePokemons = favorites;
    });
  }

  removeAllFavorites() {
    // Aquí debes implementar la lógica para eliminar todos los pokémon favoritos del backend
  }
}
