import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardHrComponent} from './board-hr.component';
import {UserActionFormComponent} from './components/user-action-form/user-action-form.component';

const routes: Routes = [
  {
    path: '',
    component: BoardHrComponent
  },
  {
    path: 'user/add',
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
