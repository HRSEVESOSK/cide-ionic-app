import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {InspectionPage} from "../inspection/inspection";

/**
 * Generated class for the EstablishmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-establishment',
  templateUrl: 'establishment.html',
})
export class EstablishmentPage {
  establishments: any;
  errorMessage: string;
  loggedUname : string = localStorage.getItem('app.userInfo.name');
  loggedPass: string = localStorage.getItem('app.userInfo.pass');
  descending: boolean = false;
  order: number;
  column: string = 'establishment_name';
  loader: any


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restProvider: RestProvider,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController) {
    this.loaderCreate();
  }

  getEstablishments(){
    this.restProvider.getEstablishment(this.loggedUname,this.loggedPass)
      .then(data => {
        this.establishments = data;
        this.loader.dismiss();
      })
  }

  loaderCreate() {
    this.loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loader.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EstablishmentPage');
    this.getEstablishments();
  }

  openCIModal(id,name){
    var data: { title: any; id: any; type: any } = {"title":name,"id":id, "type": "getCi"};
    //this.navCtrl.push(EstablishmentPage)
    let modalPage = this.modalCtrl.create(InspectionPage, data);
    modalPage.present();
  }

  createCIModal(id,name){
    var data: { title: any; id: any; type: any } = {"title":name,"id":id, "type": "addCi"};
    //this.navCtrl.push(EstablishmentPage)
    let modalPage = this.modalCtrl.create(InspectionPage, data);
    modalPage.present();
  }

  sort(){
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }



}
