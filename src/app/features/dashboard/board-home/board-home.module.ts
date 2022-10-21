import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardHomeComponent} from './board-home.component';
import {BoardHomeRoutingModule} from './board-home-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
    declarations: [BoardHomeComponent],
    imports: [
        CommonModule,
        BoardHomeRoutingModule,
        MatCardModule,
        MatButtonModule,
        NgxPaginationModule
    ]
})
export class BoardHomeModule {
}
