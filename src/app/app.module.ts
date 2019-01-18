import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule,HttpClient} from '@angular/common/http'
import { MyApp } from './app.component';
import { RestProvider } from '../providers/rest/rest';
import { AuthenticateProvider } from '../providers/authenticate/authenticate';
import {Transfer} from "@ionic-native/transfer";
import {File} from '@ionic-native/file';

import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [MyApp]
  /*
    [
  MyApp,
    HomePage
    LoginPage,
    EstablishmentPage,
    SearchPipe,
    SortPipe
    InspectionPage
  ]*/,
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],

  bootstrap: [IonicApp],
  entryComponents: [MyApp]
    /*
    [
    //HomePage,
    //LoginPage,
    EstablishmentPage,
    InspectionPage
  ]*/,
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    AuthenticateProvider,
    Transfer,
    File
  ]
})
export class AppModule {}
//export class LazyLoadedModule {}
