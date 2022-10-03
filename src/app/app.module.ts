import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {authInterceptorProviders} from './shared/_helpers/auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {NotifierModule} from 'angular-notifier';
import {HeaderComponent} from './features/header/header.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        NotifierModule,
        MatDialogModule
    ],
    providers: [authInterceptorProviders],
    bootstrap: [AppComponent]
})
export class AppModule {
}
