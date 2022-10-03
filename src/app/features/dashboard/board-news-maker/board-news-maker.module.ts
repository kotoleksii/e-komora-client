import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardNewsMakerComponent} from './board-news-maker.component';
import {BoardNewsMakerRoutingModule} from './board-news-maker-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PostActionFormComponent } from './components/post-action-form/post-action-form.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';


@NgModule({
  declarations: [BoardNewsMakerComponent, PostActionFormComponent],
    imports: [
        CommonModule,
        BoardNewsMakerRoutingModule,
        FormsModule,
        MatExpansionModule,
        RouterModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatPaginatorModule
    ]
})
export class BoardNewsMakerModule {
}
