import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent implements OnInit, OnDestroy {

  pokemonDetails: any;
  private destroy$ = new Subject<void>();

  constructor(private pokemonService: PokemonService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const pokemonName = params['name'];

      this.pokemonService.getPokemonDetails(pokemonName)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: any) => {
            this.pokemonDetails = data;
          },
          (error) => {
            console.error('Error fetching Pokemon details:', error);
          }
        );
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
