import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardModeratorComponent} from './board-moderator.component';
import {BoardModeratorRoutingModule} from './board-moderator-routing.module';

@NgModule({
  declarations: [BoardModeratorComponent],
  imports: [
    CommonModule,
    BoardModeratorRoutingModule
  ]
})
export class BoardModeratorModule {
}
