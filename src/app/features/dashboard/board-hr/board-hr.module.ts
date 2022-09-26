import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardHrComponent} from './board-hr.component';
import {BoardHrRoutingModule} from './board-hr-routing.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {UserActionFormComponent} from './components/user-action-form/user-action-form.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [BoardHrComponent, UserActionFormComponent, UserDetailsComponent],
    imports: [
        CommonModule,
        BoardHrRoutingModule,
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatSortModule,
        MatButtonModule,
        RouterModule,
        ReactiveFormsModule,
        MatListModule,
        MatToolbarModule,
        MatCardModule,
        FormsModule,
        MatGridListModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ]
})
export class BoardHrModule {
}
