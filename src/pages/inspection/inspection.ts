import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, ModalController} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {EstablishmentPage} from "../establishment/establishment";
import {literalArr} from "@angular/compiler/src/output/output_ast";

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
  dateNow: any;
  ciTypes: any = this.getSpecificInspectionType();
  insertCIdata = {"id":'',"inspection_date":"","inspection_coordinator":''};
  deleteCiData = {"id":''};
  ciHashedId: any;
  updateCidata = {};
  selectOptions: any;
  selected_si_type: any;
  si_inspector: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl : ViewController,
              public restProvider: RestProvider,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController) {
    this.modalTitle = this.navParams.get('title');
    this.estabId = this.navParams.get('id');
    this.modalType = this.navParams.get('type');
    this.ciHashedId = this.navParams.get('cid');
    this.ciTypes = this.navParams.get('si_types')

    if (this.modalType === 'getCi') {
      this.getCiForEstablishment(this.estabId);
    }
    if (this.modalType === 'addCi') {
      console.log(this.navParams);
      this.dateNow = new Date().toJSON().split('T')[0];
      this.insertCIdata = {
        "id": this.estabId,
        "inspection_date": this.dateNow,
        "inspection_coordinator": this.loggedUname
      };
    }

    if (this.modalType === 'addSi') {
      this.dateNow = new Date().toJSON().split('T')[0];
      this.updateCidata = {
        "id": this.ciHashedId,
        "inspection_date": this.dateNow,
        "si_type": this.ciTypes,
        "options":{
          title: 'Specific inspection types',
          //subTitle: 'Select one',
          mode: 'md'
        }
      };
      console.log("DATA SENT TO SI INSERT MODAL: ", this.updateCidata);
    }
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message + this.ciHashedId,
      duration: 1500,
      position: 'center'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.closeModal();
      this.navCtrl.push(EstablishmentPage);
    });

    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionPage');

  }

  public closeModal(){
    this.viewCtrl.dismiss();
  }

  createSIModal(id){
    this.restProvider.getInspectionSpecificType(this.loggedUname,this.loggedPass)
      .then(data => {
        var modalData: { cid: any, type: string, si_types: any, title: any } =
          {"cid":id, "type": "addSi", si_types: data, "title": id};
        let modalPage = this.modalCtrl.create(InspectionPage, modalData);
        modalPage.present();
      })
      .catch(reason => {
        console.log("GET SI TYPES LIST ERROR", reason);
      })
  }

  createCIModal(id,name){
    var data: { title: any; id: any; type: any } = {"title":name,"id":id, "type": "addCi"};
    console.log("CREATE CI DATA: ", data);
    //this.navCtrl.push(EstablishmentPage)
    let modalPage = this.modalCtrl.create(InspectionPage, data);
    modalPage.present();
  }

  getOrganisationForSIType(list){
    console.log("SELECTED SI TYPE IS: ", this.selected_si_type);
    console.log(list);
    for(let x of list) {
      if (x.code === this.selected_si_type){
        if ('inspectors' in x){
          this.si_inspector = x['inspectors'][0]['fullname'];
          console.log(this.si_inspector);
          break;
        }
        else{
          this.si_inspector = 'No organization for selected SI type';
        }
        console.log(x['inspectors']);
      }
    }
  }

  getSpecificInspectionType(){
    this.restProvider.getInspectionSpecificType(this.loggedUname,this.loggedPass)
      .then(data => {
        console.log("SI TYPES LIST DATA", data);
        this.ciTypes = data;
        //this.loader.dismiss();
      })
      .catch(reason => {
        console.log("GET SI TYPES LIST ERROR", reason);
      })
  }

  getCiForEstablishment(id){
    this.restProvider.getCiForEstablishment(this.loggedUname,this.loggedPass,id)
      .then(data => {
        this.coordinated = data;
        console.log("CI ESTAB DATA", data);
        //this.loader.dismiss();
      })
      .catch(reason => {
        console.log("GET CI LIST FOR ESTAB ERROR", reason);
      })

  }

  insertCoordinatedInspection(){
    console.log(this.insertCIdata);
    this.restProvider.insertCiForEstablishment(this.loggedUname,this.loggedPass, this.insertCIdata)
      .then(data=>{
        this.ciHashedId = data['inserted'];
        this.presentToast('inserted: ');
      })
      .catch(reason => {
        console.error();
      })
  }

  updateCoordinatedInspection(){
    console.log(this.insertCIdata);
    this.restProvider.insertCiForEstablishment(this.loggedUname,this.loggedPass, this.insertCIdata)
      .then(data=>{
        console.log(data);


      })
      .catch(reason => {
        console.error();
      })
  }

  deleteCoordinatedInspection(id){
    console.log(id);
    this.deleteCiData.id = id;
    this.restProvider.deleteCiById(this.loggedUname, this.loggedPass, this.deleteCiData)
      .then(data=>{
        this.ciHashedId = data['deleted'];
        this.presentToast('deleted: ');
      })



  }



}
