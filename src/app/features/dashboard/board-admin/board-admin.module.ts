import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardAdminRoutingModule} from './board-admin-routing.module';
import {BoardAdminComponent} from './board-admin.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {RouterModule} from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {TrimRolePipe} from '../../../shared/pipes/trim-role.pipe';
import {UserManagementFormComponent} from './components/user-management-form/user-management-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
    declarations: [BoardAdminComponent, TrimRolePipe, UserManagementFormComponent],
    imports: [
        CommonModule,
        BoardAdminRoutingModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatTableModule,
        MatSortModule,
        RouterModule,
        MatPaginatorModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MatCheckboxModule,
        MatChipsModule,
        MatButtonModule
    ]
})
export class BoardAdminModule {
}
