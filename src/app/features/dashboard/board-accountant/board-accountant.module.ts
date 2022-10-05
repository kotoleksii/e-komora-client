import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardAccountantComponent} from './board-accountant.component';
import {BoardAccountantRoutingModule} from './board-accountant-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [BoardAccountantComponent],
    imports: [
        CommonModule,
        BoardAccountantRoutingModule,
        MatCardModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatButtonModule,
        RouterModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSelectModule
    ]
})
export class BoardAccountantModule {
}
