import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './shared/_guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module')
      .then((m) => m.HomeModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module')
      .then((m) => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./features/register/register.module')
      .then((m) => m.RegisterModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.module')
      .then((m) => m.LoginModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module')
      .then((m) => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
