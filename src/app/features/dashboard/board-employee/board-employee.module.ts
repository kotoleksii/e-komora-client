import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardEmployeeComponent} from './board-employee.component';
import {BoardEmployeeRoutingModule} from './board-employee-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';


@NgModule({
  declarations: [BoardEmployeeComponent],
  imports: [
    CommonModule,
    BoardEmployeeRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ]
})

export class BoardEmployeeModule {
}
