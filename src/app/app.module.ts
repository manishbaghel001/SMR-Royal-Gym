import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebase } from './firebase';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { MainscreenComponent } from './mainboard/mainscreen/mainscreen.component';
import { LoginComponent } from './mainboard/login/login.component';
import { NetworkStatusService } from './services/networkstatus.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    MainscreenComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebase.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    ProgressSpinnerModule,
    CommonModule,
    ToastModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    NetworkStatusService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
