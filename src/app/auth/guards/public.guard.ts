import { Injectable, inject } from "@angular/core";
import { CanActivateFn, CanMatchFn, Router, UrlTree } from "@angular/router";
import { Observable, map, tap } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root'})

export class PublicGuard {}

const isAuthenticated = (): | boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {

   const authService = inject( AuthService );
   const router = inject( Router );

   return authService.checkAuthentication()
    .pipe(
      // when is aunthentificated can not move to login
      tap( (isAuthenticated: boolean ) => {
        if ( isAuthenticated ) {
          router.navigate(['./'])
        }
      }),
      // When logout redirect lo login
      map( isAuthenticated => !isAuthenticated )
      )
}

export const publicActivateGuard: CanActivateFn = isAuthenticated;
export const publicMatchGuard: CanMatchFn = isAuthenticated;
