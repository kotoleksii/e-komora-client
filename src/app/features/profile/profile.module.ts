import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatCardModule,
    MatButtonModule,
    RouterModule
  ]
})

export class ProfileModule {
}
