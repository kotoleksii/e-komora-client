import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardNewsMakerComponent} from './board-news-maker.component';
import {AddPostComponent} from './components/add-post/add-post.component';

const routes: Routes = [
  {
    path: '',
    component: BoardNewsMakerComponent
  },
  {
    path: 'posts/add',
    component: AddPostComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class BoardNewsMakerRoutingModule {
}
