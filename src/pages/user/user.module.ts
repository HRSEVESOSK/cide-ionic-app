import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPage } from './user';
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [UserPage],
  imports: [IonicPageModule.forChild(UserPage),PipesModule,TranslateModule],
})
export class UserPageModule {}
