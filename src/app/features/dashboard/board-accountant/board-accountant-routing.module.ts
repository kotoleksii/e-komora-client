import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardAccountantComponent} from './board-accountant.component';
import {MaterialActionFormComponent} from './components/material-action-form/material-action-form.component';

let routes: Routes;
routes = [
    {
        path: '',
        component: BoardAccountantComponent
    },
    {
        path: 'user/:userId/material/:type',
        component: MaterialActionFormComponent
    },
    {
        path: 'user/:userId/material/:materialId/:type',
        component: MaterialActionFormComponent,
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
