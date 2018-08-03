import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, ModalController, AlertController, Events} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {EstablishmentPage} from "../establishment/establishment";
import {literalArr} from "@angular/compiler/src/output/output_ast";
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';


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
  coordId: any;
  coordinated:any;
  specific: any;
  criteria: any;
  loggedUname : string = localStorage.getItem('app.userInfo.name');
  loggedPass: string = localStorage.getItem('app.userInfo.pass');
  modalType: any;
  dateNow: any;
  ciTypes: any;
  insertCIdata = {"id":'',"inspection_date":"","inspection_coordinator":''};
  deleteCIData = {"id":''};
  deleteSIData = {"id":''};
  ciHashedId: any;
  updateCidataForm = {};
  selectOptions: any;
  selected_si_type: any;
  si_inspector: any;
  si_id: any;
  si_inspector_role: any;
  si_inspection_date: any;
  si_criteria: any;
  si_criteria_score_list: any;
  si_criteria_score: any = {'group':'','criteria':'','score':'', "note":''};
  si_score_data:any = [];
  si_issue_last_update: any;
  si_issue_deadline_warning: any;
  si_report: any;
  date_now = new Date().toJSON().split('T')[0];
  inspection_date: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl : ViewController,
              public restProvider: RestProvider,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private transfer: Transfer,
              private file: File,
              public alertCtrl: AlertController) {
    this.modalTitle = this.navParams.get('title');
    this.estabId = this.navParams.get('id');
    this.si_id = this.navParams.get('sid');
    this.modalType = this.navParams.get('type');
    this.ciHashedId = this.navParams.get('cid');
    this.ciTypes = this.navParams.get('si_types');
    this.si_criteria = this.navParams.get('si_criteria');

    if (this.modalType === 'getCi') {
      this.getCiForEstablishment(this.estabId);
    }

    if (this.modalType === 'addSiIssue') {
      this.si_issue_last_update = new Date().toJSON().split('T')[0];
      this.si_issue_deadline_warning = new Date().toJSON().split('T')[0];

    }

    if (this.modalType === 'getSi') {
      this.getSiForCi(this.ciHashedId);
    }
    if (this.modalType === 'addCi') {
      console.log(this.navParams);
      this.dateNow = new Date().toJSON().split('T')[0];
      this.inspection_date = this.dateNow;
      this.insertCIdata = {
        "id": this.estabId,
        "inspection_date": this.dateNow,
        "inspection_coordinator": this.loggedUname
      };
    }

    if (this.modalType === 'addSi') {
      this.dateNow = new Date().toJSON().split('T')[0];
      this.si_inspection_date = this.date_now;
      this.si_id = this.ciHashedId;
      this.getSpecificInspectionType();
      this.updateCidataForm = {
        "si_type": this.ciTypes,
        "options":{
          title: 'Specific inspection types',
          //subTitle: 'Select one',
          mode: 'md'
        }
      };
      console.log("DATA SENT TO SI INSERT MODAL: ", this.updateCidataForm);
    }


    if (this.modalType === 'addSiScore'){
      this.getSpecificInspectionTypeScore();

    }

  }


  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message + this.ciHashedId,
      duration: 1500,
      position: 'center'
    });

    if (this.ciHashedId != 0){
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
        this.closeModal();
        this.navCtrl.push(EstablishmentPage);
      });
    }
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
        console.log("DATA SENT TO SI INSERT: ", modalData);
        let modalPage = this.modalCtrl.create(InspectionPage, modalData);
        modalPage.present();
      })
      .catch(reason => {
        console.log("GET SI TYPES LIST ERROR", reason);
      })
  }

  openSIScoreModal(id){
    console.log("ID of SI: ", id);
    this.si_id = id;
    this.restProvider.getInspectionSpecificCriterior(this.loggedUname,this.loggedPass)
      .then(data => {
        this.si_criteria = data;
        console.log(data);
        var modalData: { sid: any, type: string, si_criteria: any, title: any } =
          {"sid":id, "type": "addSiScore", "si_criteria": data, "title": "Criteria for: " + id};
        let modalPage = this.modalCtrl.create(InspectionPage, modalData, {cssClass: "modal-fullscreen"});
        modalPage.present();
      })
      .catch(reason => {
        console.log("GET SI TYPES LIST ERROR", reason);
      })
  }

  openSIIssueModal(id){
    console.log("Opening Open Issue Modal For: ", id);
    this.si_id = id;
    var modalData: {sid: any, title: any, type: any} = {"sid": id, title: "Open issues for: "+id, type:"addSiIssue"};
    let modalPage = this.modalCtrl.create(InspectionPage, modalData, {cssClass: "modal-fullscreen"});
    modalPage.present();
    /*
    this.restProvider.getInspectionSpecificType(this.loggedUname,this.loggedPass)
      .then(data => {
        var modalData: { cid: any, type: string, si_types: any, title: any } =
          {"cid":id, "type": "addSiIssue", si_types: data, "title": "Open issues for: " + id};
        let modalPage = this.modalCtrl.create(InspectionPage, modalData, {cssClass: "modal-fullscreen"});
        modalPage.present();
      })
      .catch(reason => {
        console.log("GET SI TYPES LIST ERROR", reason);
      })
      */
  }



  openSIModal(id){
    console.log("SI modal data: ", id);
    this.coordId = id;
    var data: { cid: any,title: any; id: any; type: any } = {"cid":id,"title":id,"id":this.coordId, "type": "getSi"};
    //this.navCtrl.push(EstablishmentPage)
    let modalPage = this.modalCtrl.create(InspectionPage, data, {cssClass: "modal-fullscreen"});
    modalPage.present();
  }

  uploadSiReportModal(id){
    console.log("Opening Upload SI Report Modal For: ", id);
    this.si_id = id;
    var modalData: {sid: any, title: any, type: any} = {"sid": id, title: "Upload report for: "+id, type:"uploadSiReport"};
    let modalPage = this.modalCtrl.create(InspectionPage, modalData, {cssClass: "modal-fullscreen"});
    modalPage.present();
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
          this.si_inspector_role = x['inspectors'][0]['id'];
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

  getSpecificInspectionTypeScore(){
    this.restProvider.getInspectionSpecificCriteriorScore(this.loggedUname,this.loggedPass)
      .then(data=>{
        console.log("SI SCORE VALUES", data);
        this.si_criteria_score_list = data;
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

  updateCoordinatedInspection(id){
    this.ciHashedId = id;
    let updateCIdata = {"id":this.ciHashedId,
      "inspection_date":this.si_inspection_date,
      "inspection_coordinator":this.si_inspector,
      "inspector_id_person_role":this.si_inspector_role};
    console.log(updateCIdata);
    this.restProvider.updateCiForEstablishment(this.loggedUname,this.loggedPass, updateCIdata)
      .then(data=>{
        this.ciHashedId = data['inserted'];
        this.presentToast('inserted: ');
      })
      .catch(reason => {
        console.error();
      })
  }
  updateSpecificInspectionScore(){
    console.log(this.si_criteria_score);

  }
  deleteCoordinatedInspection(id){
    console.log("Function deleteCoordinatedInspection was called with parameter id=", id);
    this.deleteCIData.id = id;
    this.restProvider.deleteCiById(this.loggedUname, this.loggedPass, this.deleteCIData)
      .then(data=>{
        this.ciHashedId = data['deleted'];
        this.presentToast('deleted: ');
      })
  }

  deleteSpecificInspection(id){
    console.log("Function deleteSpecificInspection was called with parameter id=", id);
    this.deleteSIData.id = id;
    this.restProvider.deleteSiById(this.loggedUname, this.loggedPass, this.deleteSIData)
      .then(data=>{
        this.ciHashedId = data['deleted'];
        this.presentToast('deleted: ');
      })
  }

  getSiForCi(id){
    console.log(id);
    this.ciHashedId = id;
    this.restProvider.getSpecificForCoordinated(this.loggedUname, this.loggedPass, id)
      .then(data=>{
        this.specific = data;
      })
      .catch(reason => {
        console.log("GET SI LIST FOR CI ERROR", reason);
      })

  }


  // full example
  uploadReport(id) {
    const fileTransfer: TransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'report_'+id+'.pdf',
      headers: {}
    }
    fileTransfer.upload('<file path>', 'http://192.168.1.77:8080/api/inspection/specific/upload', options)
      .then((data) => {
        // success
      }, (err) => {
        // error
      })
  }

  downloadReport() {
    const fileTransfer: TransferObject = this.transfer.create();
    const url = 'http://www.example.com/file.pdf';
    fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      // handle error
    });
  }

  changeListener($event,id) : void {
    this.file = $event.target.files[0];
    console.log("REPORT TO BE UPLADED FOR SI "+id+": ", this.file);
    this.restProvider.uploadReportForCi(this.loggedUname, this.loggedPass,  $event.target.files[0],id)
      .then(data=>{
        console.log("Report has been sucesfully uploaded for CI: ", data);
      })
      .catch(reason => {
        console.log("ERROR IN UPLOADING REPORT FOR CI", reason);
      })

  }





}
