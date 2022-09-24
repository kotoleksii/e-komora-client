import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardHrComponent} from './board-hr.component';
import {UserActionFormComponent} from './components/user-action-form/user-action-form.component';
import {UserDetailsComponent} from './components/user-details/user-details.component';

const routes: Routes = [
  {
    path: '',
    component: BoardHrComponent
  },
  {
    path: 'user/add',
    component: UserActionFormComponent
  },
  {
    path: 'user/details/:id',
    component: UserDetailsComponent
  },
  {
    path: 'user/edit/:id',
    component: UserActionFormComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class BoardHrRoutingModule {
}
