import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
@NgModule({
  declarations: [LoginPage],
  imports: [IonicPageModule.forChild(LoginPage),TranslateModule],
})
export class LoginPageModule {}
