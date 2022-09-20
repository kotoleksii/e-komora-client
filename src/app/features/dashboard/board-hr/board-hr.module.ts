import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardHrComponent} from './board-hr.component';
import {BoardHrRoutingModule} from './board-hr-routing.module';

@NgModule({
  declarations: [BoardHrComponent],
  imports: [
    CommonModule,
    BoardHrRoutingModule
  ]
})
export class BoardHrModule {
}
