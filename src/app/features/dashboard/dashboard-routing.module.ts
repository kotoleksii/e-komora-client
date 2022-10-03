import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../shared/_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children:
      [
        {
          path: 'accountant',
          loadChildren: () => import('./board-accountant/board-accountant.module')
            .then((m) => m.BoardAccountantModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'hr',
          loadChildren: () => import('./board-hr/board-hr.module')
            .then((m) => m.BoardHrModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'employee',
          loadChildren: () => import('./board-employee/board-employee.module')
            .then((m) => m.BoardEmployeeModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'news-maker',
          loadChildren: () => import('./board-news-maker/board-news-maker.module')
            .then((m) => m.BoardNewsMakerModule),
          canActivate: [AuthGuard]
        },
      ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
