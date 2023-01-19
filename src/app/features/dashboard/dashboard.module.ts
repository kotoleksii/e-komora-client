import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {BoardAdminComponent} from './board-admin/board-admin.component';
import {LettersAvatarModule} from 'ngx-letters-avatar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
    declarations: [DashboardComponent, BoardAdminComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        LettersAvatarModule,
        MatCardModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule
    ]
})

export class DashboardModule {
}
