import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';;
import { Error404pageComponent } from './shared/pages/error404page/error404page.component';

import { canActivateGuard, canMatchGuard } from './auth/guards/auth.guard';
import { publicActivateGuard, publicMatchGuard } from './auth/guards/public.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    canActivate: [ publicActivateGuard  ],
    canMatch: [ publicMatchGuard ]
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then( m => m.HeroesModule ),
    canActivate: [ canActivateGuard ],
    canMatch: [ canMatchGuard ]
  },
  {
    path: '404',
    component: Error404pageComponent
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
