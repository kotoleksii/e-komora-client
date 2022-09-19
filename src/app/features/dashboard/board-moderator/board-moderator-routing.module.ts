import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardModeratorComponent} from './board-moderator.component';

const routes: Routes = [
  {
    path: '',
    component: BoardModeratorComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class BoardModeratorRoutingModule {
}
