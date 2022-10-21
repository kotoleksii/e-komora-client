import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './shared/_guards/auth.guard';

const routes: Routes = [
    {
        path: 'home',
        title: 'єРобота',
        loadChildren: () => import('./features/home/home.module')
            .then((m) => m.HomeModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module')
            .then((m) => m.DashboardModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'auth/register',
        title: 'Реєстрація',
        loadChildren: () => import('./features/register/register.module')
            .then((m) => m.RegisterModule)
    },
    {
        path: 'auth/login',
        title: 'Вхід',
        loadChildren: () => import('./features/login/login.module')
            .then((m) => m.LoginModule)
    },
    {
        path: 'profile',
        title: 'Мій профіль',
        loadChildren: () => import('./features/profile/profile.module')
            .then((m) => m.ProfileModule),
        canActivate: [AuthGuard]
    },
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'auth/login'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
