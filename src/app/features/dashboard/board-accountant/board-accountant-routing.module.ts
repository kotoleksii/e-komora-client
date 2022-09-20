import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardAccountantComponent} from './board-accountant.component';

let routes: Routes;
routes = [
  {
    path: '',
    component: BoardAccountantComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class BoardAccountantRoutingModule {
}
