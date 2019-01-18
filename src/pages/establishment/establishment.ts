import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";

@IonicPage()
@Component({
  templateUrl: 'establishment.html',
})
export class EstablishmentPage {
  establishments: any;
  errorMessage: string;
  loggedUname : string = localStorage.getItem('app.userInfo.name');
  loggedPass: string = localStorage.getItem('app.userInfo.pass');
  loggedRole: string = localStorage.getItem('app.userInfo.role');
  selectedLanguage: string = localStorage.getItem('app.userInfo.lang');
  descending: boolean = false;
  order: number;
  column: string = 'establishment_name';
  loader: any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restProvider: RestProvider,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
    this.loaderCreate();
  }

  getEstablishments(){
    this.restProvider.getEstablishment(this.loggedUname,this.loggedPass)
      .then(data => {
        this.establishments = data;
        this.loader.dismiss();
      })
      .catch(reason => {
        console.log("GET ESTABLISHMENT LIST FAILED", reason);
        this.loader.dismiss();
        this.presentAlert(reason);
        this.navCtrl.push('HomePage')
      })
  }

  presentAlert(reason) {
    const alert = this.alertCtrl.create({
      title: reason.name,
      subTitle: reason.message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  loaderCreate() {
    this.loader = this.loadingCtrl.create({
      content: '',
      spinner: 'dots',
      cssClass: 'transparent'
    });
    this.loader.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EstablishmentPage');
    this.getEstablishments();
  }

  openCIModal(id,name){
    var data: { title: any; id: any; type: any } = {"title":name,"id":id, "type": "getCi"};
    console.log("CI FOR ESTAB DATA", data);
    let modalPage = this.modalCtrl.create('InspectionPage', data, {cssClass: "modal-fullscreen"});
    modalPage.present();
  }

  /*
  createCIModal(id,name){
    var data: { title: any; id: any; type: any } = {"title":name,"id":id, "type": "addCi"};
    console.log("CREATE CI DATA: ", data);
    let modalPage = this.modalCtrl.create('InspectionPage', data, {cssClass:"modal-fullscreen"});
    modalPage.present();
  }
  */

  createCIModal2(id, name) {
    this.restProvider.getInspectionSpecificType(this.loggedUname, this.loggedPass, 'CI',this.selectedLanguage)
      .then(data => {
        let modalData: { title: any; id: any; type: any, ci_types: any } = {"title": name, "id": id, "type": "addCi", ci_types : data};
        console.log("CREATE CI DATA: ", data);
        let modalPage = this.modalCtrl.create('InspectionPage', modalData, {cssClass: "modal-fullscreen"});
        modalPage.present();
      })
      .catch(reason => {
        console.log("GET SI TYPES LIST ERROR", reason);
      })
  }

  sort(){
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }



}
