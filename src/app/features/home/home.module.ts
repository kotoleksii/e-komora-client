import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {NgxPaginationModule} from 'ngx-pagination';
import {ScrollToTopComponent} from './scroll-to-top/scroll-to-top.component';
import {FooterComponent} from './footer/footer.component';
import {TitleComponent} from './title/title.component';


@NgModule({
    declarations: [HomeComponent, ScrollToTopComponent, FooterComponent, TitleComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        MatCardModule,
        MatButtonModule,
        NgxPaginationModule,
    ]
})
export class HomeModule {
}
