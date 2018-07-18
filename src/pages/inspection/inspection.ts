import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";

/**
 * Generated class for the InspectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inspection',
  templateUrl: 'inspection.html',
})
export class InspectionPage {
  modalTitle:any;
  estabId:any;
  coordinated:any;
  loggedUname : string = localStorage.getItem('app.userInfo.name');
  loggedPass: string = localStorage.getItem('app.userInfo.pass');
  modalType: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl : ViewController,
              public restProvider: RestProvider) {
    this.modalTitle = this.navParams.get('title');
    this.estabId = this.navParams.get('id');
    this.modalType = this.navParams.get('type');
    if (this.modalType === 'getCi'){
      this.getCiForEstablishment(this.estabId);
    }


  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionPage');

  }

  public closeModal(){
    this.viewCtrl.dismiss();
  }

  getCiForEstablishment(id){
    this.restProvider.getCiForEstablishment(this.loggedUname,this.loggedPass,id)
      .then(data => {
        this.coordinated = data;
        console.log("CI ESTAB DATA", data);
        //this.loader.dismiss();
      })

  }

}
