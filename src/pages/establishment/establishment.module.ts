import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstablishmentPage } from './establishment';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [EstablishmentPage],
  imports: [IonicPageModule.forChild(EstablishmentPage),PipesModule],
})
export class EstablishmentPageModule {}
