import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardEmployeeComponent} from './board-employee.component';

const routes: Routes = [
  {
    path: '',
    component: BoardEmployeeComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class BoardEmployeeRoutingModule {
}
