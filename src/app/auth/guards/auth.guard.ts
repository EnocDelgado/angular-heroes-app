import { Injectable, inject } from "@angular/core";
import { CanActivateFn, CanMatchFn, Router, UrlTree } from "@angular/router";
import { Observable, tap } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root'})

export class AuthGuard {}

const isAuthenticated = (): | boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {

   const authService = inject( AuthService );
   const router = inject( Router );

   return authService.checkAuthentication()
    .pipe(
      tap( (isAuthenticated: boolean ) => {
        if ( !isAuthenticated ) {
          router.navigate(['./auth/login'])
        }
      })
    )
}

export const canActivateGuard: CanActivateFn = isAuthenticated;
export const canMatchGuard: CanMatchFn = isAuthenticated;

/*
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const canActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log('CanActive');
  console.log({ route, state });

  return false;
}

export const canMachGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('CanMatch');
  console.log({ route, segments })

  return false;
};
*/

