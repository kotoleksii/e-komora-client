import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardUserComponent} from './board-user.component';
import {BoardUserRoutingModule} from './board-user-routing.module';


@NgModule({
  declarations: [BoardUserComponent],
  imports: [
    CommonModule,
    BoardUserRoutingModule
  ]
})

export class BoardUserModule {
}
