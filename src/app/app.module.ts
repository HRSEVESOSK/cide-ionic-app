import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule} from '@angular/common/http'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RestProvider } from '../providers/rest/rest';
import {LoginPage} from "../pages/login/login";
import { AuthenticateProvider } from '../providers/authenticate/authenticate';
import {EstablishmentPage} from "../pages/establishment/establishment";
import {SearchPipe} from "../pipes/search/search";
import {SortPipe} from "../pipes/sort/sort";
import {InspectionPage} from "../pages/inspection/inspection";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    EstablishmentPage,
    SearchPipe,
    SortPipe,
    InspectionPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    EstablishmentPage,
    InspectionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    AuthenticateProvider
  ]
})
export class AppModule {}
