import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  // Reactive Form
  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:         new FormControl('')
  })

  public publisher = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ]

  constructor(
    private heroesService: HeroesService,
    private activedRoute :ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  // getter
  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {

    if ( !this.router.url.includes('edit') ) return;

    this.activedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) ),
      )
      .subscribe( hero => {

        if ( !hero ) return this.router.navigateByUrl('/');
        // clean form
        this.heroForm.reset( hero );

        return;
      })
  }

  onSubmit(): void {

    if ( this.heroForm.invalid ) return;

    if ( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.superhero } updated!`);
        });

        return;
    }


    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        // desplay snackbar, and nagivate to heroes/edit/ h
        this.router.navigate(['/heroes/edit', hero.id])
        this.showSnackbar(`${ hero.superhero } created!`);
      })
  }

  onDeleteHero() {
    if ( !this.currentHero.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: this.heroForm.value
    })

    dialogRef.afterClosed()
      .pipe(
        filter( ( result: boolean ) => result ), // false
        switchMap( () => this.heroesService.deleteHerobyId( this.currentHero.id ) ),
        filter( ( wasDeleted: boolean ) => wasDeleted ) // true
      )
      //redirect
      .subscribe( () => {
          this.router.navigate(['/heroes'])
      })
    }
    // dialogRef.afterClosed()
    //   .subscribe( result => {
    //     if ( !result ) return;
    //     // delete our hero
    //     this.heroesService.deleteHerobyId( this.currentHero.id )
    //       .subscribe( wasDeleted => {
    //         if ( wasDeleted )
    //         //redirect
    //         this.router.navigate(['/heroes'])
    //       });
    //   })

  showSnackbar( message: string ): void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}


