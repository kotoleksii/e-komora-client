import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardAccountantComponent} from './board-accountant.component';
import {BoardAccountantRoutingModule} from './board-accountant-routing.module';

@NgModule({
  declarations: [BoardAccountantComponent],
  imports: [
    CommonModule,
    BoardAccountantRoutingModule
  ]
})
export class BoardAccountantModule {
}
