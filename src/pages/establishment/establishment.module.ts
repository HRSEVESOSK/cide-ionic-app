import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstablishmentPage } from './establishment';
import {PipesModule} from "../../pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [EstablishmentPage],
  imports: [IonicPageModule.forChild(EstablishmentPage),PipesModule,TranslateModule],
})
export class EstablishmentPageModule {}
