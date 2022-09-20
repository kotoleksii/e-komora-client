import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardHrComponent} from './board-hr.component';

const routes: Routes = [
  {
    path: '',
    component: BoardHrComponent
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
