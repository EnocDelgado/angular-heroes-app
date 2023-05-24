import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor( private http: HttpClient ) { }

  // expose our user
  get currentUser(): User|undefined {
    if ( !this.user ) return undefined;
    // is like spreed operator, send a copy of all characteristics of our data
    return structuredClone( this.user );
  }

  login( emial: string, password: string ): Observable<User> {

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => { this.user = user }),
        tap( user => localStorage.setItem( 'token', user.id.toString() ) )
      );
  }

  checkAuthentication(): Observable<boolean> {

    if ( !localStorage.getItem('token') ) return of( false );

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
    .pipe(
      tap( user => this.user = user ),
      map( user =>  !!user ), //true
      catchError( error => of( false ) )
    );
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }
}
