import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardHomeComponent} from './board-home.component';

const routes: Routes = [
    {
        path: '',
        component: BoardHomeComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class BoardHomeRoutingModule {
}
