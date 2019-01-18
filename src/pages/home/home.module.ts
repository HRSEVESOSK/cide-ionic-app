import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {HttpLoaderFactory} from "../../app/app.module";

@NgModule({
  declarations: [HomePage],
  imports: [IonicPageModule.forChild(HomePage),
    TranslateModule],
})
export class HomePageModule {
  /*constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('hr');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }*/
}
