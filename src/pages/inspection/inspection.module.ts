import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionPage } from './inspection';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InspectionPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionPage),
    TranslateModule
  ],
})
export class InspectionPageModule {}
