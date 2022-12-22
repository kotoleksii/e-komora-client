import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardNewsComponent} from './board-news.component';

const routes: Routes = [
    {
        path: '',
        component: BoardNewsComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class BoardNewsRoutingModule {
}
