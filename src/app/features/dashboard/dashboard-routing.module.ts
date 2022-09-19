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
          path: 'admin',
          loadChildren: () => import('./board-admin/board-admin.module')
            .then((m) => m.BoardAdminModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'mod',
          loadChildren: () => import('./board-moderator/board-moderator.module')
            .then((m) => m.BoardModeratorModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'user',
          loadChildren: () => import('./board-user/board-user.module')
            .then((m) => m.BoardUserModule),
          canActivate: [AuthGuard]
        }
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
