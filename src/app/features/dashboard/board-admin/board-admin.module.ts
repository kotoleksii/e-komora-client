import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardAdminComponent} from './board-admin.component';
import {BoardAdminRoutingModule} from './board-admin-routing.module';


@NgModule({
  declarations: [BoardAdminComponent],
  imports: [
    CommonModule,
    BoardAdminRoutingModule
  ]
})
export class BoardAdminModule {
}
