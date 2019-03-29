import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetPasswordPage } from './reset-password';
import {TranslateModule} from "@ngx-translate/core";
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [ResetPasswordPage],
  imports: [IonicPageModule.forChild(ResetPasswordPage),TranslateModule,RecaptchaModule],
})
export class ResetPasswordPageModule {}
