import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardAdminComponent} from './board-admin.component';
import {UserManagementFormComponent} from './components/user-management-form/user-management-form.component';

const routes: Routes = [
    {
        path: '',
        component: BoardAdminComponent
    },
    {
        path: 'user/edit/:id',
        component: UserManagementFormComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class BoardAdminRoutingModule {
}
