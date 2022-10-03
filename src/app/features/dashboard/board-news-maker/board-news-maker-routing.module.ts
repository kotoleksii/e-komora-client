import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardNewsMakerComponent} from './board-news-maker.component';
import {PostActionFormComponent} from './components/post-action-form/post-action-form.component';

const routes: Routes = [
  {
    path: '',
    component: BoardNewsMakerComponent
  },
  {
    path: 'posts/add',
    component: PostActionFormComponent
  },
  {
    path: 'posts/edit/:id',
    component: PostActionFormComponent
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
