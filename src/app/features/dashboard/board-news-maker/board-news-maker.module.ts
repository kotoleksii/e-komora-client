import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardNewsMakerComponent} from './board-news-maker.component';
import {BoardNewsMakerRoutingModule} from './board-news-maker-routing.module';
import {FormsModule} from '@angular/forms';
import { AddPostComponent } from './components/add-post/add-post.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [BoardNewsMakerComponent, AddPostComponent],
  imports: [
    CommonModule,
    BoardNewsMakerRoutingModule,
    FormsModule,
    MatExpansionModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class BoardNewsMakerModule {
}
