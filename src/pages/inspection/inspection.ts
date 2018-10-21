import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  ModalController,
  AlertController,
  LoadingController
} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  templateUrl: 'inspection.html',
})
export class InspectionPage {
  loader: any;
  modalTitle: any;
  estabId: any;
  coordId: any;
  coordinated: any;
  specific: any;
  criteria: any;
  isEnabled: boolean = false;
  loggedUname: string = localStorage.getItem('app.userInfo.name');
  loggedPass: string = localStorage.getItem('app.userInfo.pass');
  loggedRole: string = localStorage.getItem('app.userInfo.role');
  modalType: any;
  dateNow: any;
  ciTypes: any;
  insertCIdata = {"id": '', "inspection_date": "", "inspection_coordinator": ''};
  deleteCIData = {"id": ''};
  deleteSIData = {"id": ''};
  ciHashedId: any;
  updateCidataForm = {};
  selected_si_type: any;
  si_inspector: any;
  si_id: any;
  si_inspector_role: any;
  si_inspection_date: any;
  si_criteria: any;
  si_issues: any = [];
  si_criteria_score_list: any;
  si_criteria_group_id: any = [];
  date_now = new Date().toJSON().split('T')[0];
  inspection_date: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public restProvider: RestProvider,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private file: File,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,) {
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
      console.log("GETTING ISSUES FOR: ", this.si_id);
      this.getIssuesForCI(this.si_id);
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
        "options": {
          title: 'Specific inspection types',
          //subTitle: 'Select one',
          mode: 'md'
        }
      };
      console.log("DATA SENT TO SI INSERT MODAL: ", this.updateCidataForm);
    }


    if (this.modalType === 'addSiScore') {
      this.getSpecificInspectionTypeScore();

    }

  }

  catchToast(message) {
    let toast = this.toastCtrl.create({
      message: message + ' on ' + this.ciHashedId + ' for ' + this.loggedRole,
      duration: 2000,
      position: 'center'
    });
    toast.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message + this.ciHashedId,
      duration: 2000,
      position: 'center'
    });

    if (this.ciHashedId != 0) {
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
        this.closeModal();
        this.navCtrl.push('EstablishmentPage');
        this.navCtrl.pop;
      });
    }
    toast.present();
  }

 presentErrorMessage(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'center'
    });
    toast.onDidDismiss(() => {
      this.closeModal();
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionPage');

  }

  loaderCreate() {
    this.loader = this.loadingCtrl.create({
      content: '',
      spinner: 'dots',
      cssClass: 'transparent'
    });
    this.loader.present();
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  createSIModal(id) {
    this.restProvider.getInspectionSpecificType(this.loggedUname, this.loggedPass)
      .then(data => {
        var modalData: { cid: any, type: string, si_types: any, title: any } =
          {"cid": id, "type": "addSi", si_types: data, "title": id};
        console.log("DATA SENT TO SI INSERT: ", modalData);
        let modalPage = this.modalCtrl.create('InspectionPage', modalData, {cssClass: "modal-fullscreen"});
        modalPage.present();
      })
      .catch(reason => {
        console.log("GET SI TYPES LIST ERROR", reason);
      })
  }

  openSIScoreModal(id) {
    this.loaderCreate();
    console.log("ID of SI: ", id);
    this.si_id = id;
    this.restProvider.getScoreForSI(this.loggedUname, this.loggedPass, this.si_id)
      .then(data => {
        this.criteria = data;
        console.log("SCORE DATA FOR SI " + this.si_id + " are ", data)
      })
      .catch(reason => {
        console.error("ERROR in getting score for SI", reason);
      });
    
    this.restProvider.getInspectionSpecificCriterior(this.loggedUname, this.loggedPass)
      .then(data => {
        this.si_criteria = data;
        console.log(data);
        var modalData: { sid: any, type: string, si_criteria: any, title: any } =
          {"sid": id, "type": "addSiScore", "si_criteria": data, "title": "Criteria for: " + id};
        let modalPage = this.modalCtrl.create('InspectionPage', modalData, {cssClass: "modal-fullscreen"});
        this.loader.dismiss();
        modalPage.present();
      })
      .catch(reason => {
        console.log("GET SI TYPES LIST ERROR", reason);
        this.loader.dismiss();
      })
  }

  openSIIssueModal(id) {
    console.log("Opening Open Issue Modal For: ", id);
    this.navCtrl.pop;
    this.si_id = id;
    var modalData: { sid: any, title: any, type: any } = {
      "sid": id,
      title: "Open issues for: " + id,
      type: "addSiIssue"
    };
    let modalPage = this.modalCtrl.create('InspectionPage', modalData, {cssClass: "modal-fullscreen"});
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

  openSIModal(id) {
    console.log("SI modal data: ", id);
    this.coordId = id;
    var data: { cid: any, title: any; id: any; type: any } = {
      "cid": id,
      "title": id,
      "id": this.coordId,
      "type": "getSi"
    };
    //this.navCtrl.push(EstablishmentPage)
    let modalPage = this.modalCtrl.create('InspectionPage', data, {cssClass: "modal-fullscreen"});
    modalPage.present();
  }

  uploadSiReportModal(id) {
    console.log("Opening Upload SI Report Modal For: ", id);
    this.si_id = id;
    var modalData: { sid: any, title: any, type: any } = {
      "sid": id,
      title: "Upload report for: " + id,
      type: "uploadSiReport"
    };
    let modalPage = this.modalCtrl.create('InspectionPage', modalData, {cssClass: "modal-fullscreen"});
    modalPage.present();
  }

  createCIModal(id, name) {
    var data: { title: any; id: any; type: any } = {"title": name, "id": id, "type": "addCi"};
    console.log("CREATE CI DATA: ", data);
    let modalPage = this.modalCtrl.create('InspectionPage', data, {cssClass: "modal-fullscreen"});
    modalPage.present();
  }

  getOrganisationForSIType(list) {
    console.log("SELECTED SI TYPE IS: ", this.selected_si_type);
    console.log(list);
    for (let x of list) {
      if (x.code === this.selected_si_type) {
        if ('inspectors' in x) {
          this.si_inspector = x['inspectors'][0]['fullname'];
          this.si_inspector_role = x['inspectors'][0]['id'];
          console.log(this.si_inspector);
          break;
        }
        else {
          this.si_inspector = 'No organization for selected SI type';
        }
        console.log(x['inspectors']);
      }
    }
  }

  // CIDE HTTP REST API CALLS
  getSpecificInspectionType() {
    this.loaderCreate();
    this.restProvider.getInspectionSpecificType(this.loggedUname, this.loggedPass)
      .then(data => {
        console.log("SI TYPES LIST DATA", data);
        this.ciTypes = data;
        this.loader.dismiss();
      })
      .catch(reason => {
        console.log("GET SI TYPES LIST ERROR", reason);
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
        console.error(reason);
      })
  }

  getSpecificInspectionTypeScore() {
    this.loaderCreate();
    this.restProvider.getSICriteriorScoreList(this.loggedUname, this.loggedPass)
      .then(data => {
        console.log("SI SCORE VALUES", data);
        this.si_criteria_score_list = data;
        this.loader.dismiss();
      })
      .catch(reason => {
        console.log("GET SI TYPES LIST ERROR", reason);
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
        console.error(reason);
      })
  }

  getCiForEstablishment(id) {
    this.loaderCreate();
    this.restProvider.getCiForEstablishment(this.loggedUname, this.loggedPass, id)
      .then(data => {
        this.coordinated = data;
        console.log("CI ESTAB DATA", data);
        this.loader.dismiss();
      })
      .catch(reason => {
        console.log("GET CI LIST FOR ESTAB ERROR", reason);
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
        console.error(reason);
      })
  }

  addrow(id) {
    this.si_issues.push({last_update: new Date().toJSON().split('T')[0], 'id_specific_inspection': id});
  }

  delrow(id) {
    if ((this.si_issues).length > 1) {
      this.si_issues.pop();
    }

  }

  warningChanged(value) {
    console.log("Changed to value: ", value);
    this.isEnabled = value;
  }

  wasValued(name, value) {
    console.log("ngControl name: ", name);
    console.log("value: ", value);
    console.log("id: ", (name.split("_"))[2])
    if (name.startsWith('acc_prescriptions_') && value != '') {

    }
  }

  getIssuesForCI(id) {
    this.loaderCreate();
    this.restProvider.getInspectionSpecificIssues(this.loggedUname, this.loggedPass, id)
      .then(data => {
        this.loader.dismiss();
        console.log("CI ISSUE DATA", data);
        if ('message' in data) {
          console.log("CI: ", id + " NEMA ISSUES.");
          this.si_issues.push({'last_update': new Date().toJSON().split('T')[0], 'id_specific_inspection': id});
        }
        else {
          console.log("Data returned for SI Issues: ", data);
          this.si_issues = [];
          this.si_issues = data;
          /*
          for (let k in data){
            console.log("IDECKO: ", data[k].id);
            this.si_issues.push({'id': data[k].id,'issue_description':data[k].issue_description});
          }
          */
        }

      })
      .catch(reason => {
        this.loader.dismiss();
        console.log("GET CI ISSUES ERROR", reason);
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
        console.error(reason);
      })
  }

  insertCoordinatedInspection() {
    console.log(this.insertCIdata);
    this.loaderCreate();
    this.restProvider.insertCiForEstablishment(this.loggedUname, this.loggedPass, this.insertCIdata)
      .then(data => {
        this.ciHashedId = data['inserted'];
        this.presentToast('inserted: ');
        this.loader.dismiss();
      })
      .catch(reason => {
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
        console.error(reason);
      })
  }

  updateCoordinatedInspection(id) {
    this.ciHashedId = id;
    let updateCIdata = {
      "id": this.ciHashedId,
      "inspection_date": this.si_inspection_date,
      "inspection_coordinator": this.si_inspector,
      "inspector_id_person_role": this.si_inspector_role
    };
    console.log(updateCIdata);
    this.loaderCreate();
    this.restProvider.updateCiForEstablishment(this.loggedUname, this.loggedPass, updateCIdata)
      .then(data => {
        this.loader.dismiss();
        this.ciHashedId = data['inserted'];
        this.presentToast('inserted: ');
      })
      .catch(reason => {
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
        console.error(reason);
      })
  }


  updateSpecificInspectionIssue(id) {
    console.log("Insert / Update Issues for: ", id);
    console.log("Insert data: ", this.si_issues);
    console.log("POST DATA: ", this.si_issues);
    this.loaderCreate();
    this.restProvider.updateCiIssues(this.loggedUname, this.loggedPass, this.si_issues)
      .then(data => {
        this.ciHashedId = id;
        this.loader.dismiss();
        this.presentToast('inserted: ' + data['inserted'] + ' updated: ' + data['updated'] + ' for inspection: ');
      })
      .catch(reason => {
        this.ciHashedId = id;
        console.error(reason);
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
      })

  }

  updateSpecificInspectionScore(id) {
    this.loaderCreate();
    let criteriaScoreData = [];
    console.log("Insert / Update Criteria Score for: ", id);
    //console.log("Insert / Update Data: ", this.si_criteria_score);
    console.log("Insert / Update Data: ", this.si_criteria);
    for (let group of this.si_criteria) {
      if ("criteria" in group) {
        for (let criterior of group.criteria) {
          if ("score" in criterior) {
            let values = {};
            values['id_specific_inspection'] = id;
            values['id_criterior'] = criterior.id;
            values['id_score'] = criterior.score;
            if ("note" in criterior) {
              values['comments'] = criterior.note;
            }
            criteriaScoreData.push(values);
          }
        }
      }
    }
    //HERE WE NEED TO CALL METHOD FROM REST
    console.log("POST DATA: ", criteriaScoreData)
    this.restProvider.updateCiCriteriaScore(this.loggedUname, this.loggedPass, criteriaScoreData)
      .then(data => {
        this.ciHashedId = id;
        this.loader.dismiss();
        this.presentToast('inserted: ' + data['inserted'] + ' updated: ' + data['updated'] + ' for insection: ');
      })
      .catch(reason => {
        console.error(reason);
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
      })


    //this.restProvider.updateCiCriteriaScore(this.loggedUname, this.loggedPass, criteriaScoreData)


  }

  insertGroupScore(a, b) {
    console.log("Changing the value for: ", a, b);
    console.log(this.si_criteria[a]['value']);
    let currentScore = 0;
    let selectedScore = parseInt(b.match(/\(([^)]+)\)/)[1]);
    console.log("SELECTED SCORE NUMBER: ", selectedScore);
    if ((this.si_criteria[a]['value']).includes("(")) {
      console.log("IF ARE WE HERE???");
      currentScore = parseInt((this.si_criteria[a]['value']).match(/\(([^)]+)\)/)[1]);
      this.si_criteria[a]['value'] = (this.si_criteria[a]['value'].replace((this.si_criteria[a]['value']).match(/\(([^)]+)\)/)[1], currentScore + selectedScore));
    }
    else {
      console.log("ELSE ARE WE HERE???");
      this.si_criteria[a]['value'] = (this.si_criteria[a]['value'] + "(" + currentScore + selectedScore + ")");
    }
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  deleteCoordinatedInspection(id) {
    this.loaderCreate();
    console.log("Function deleteCoordinatedInspection was called with parameter id=", id);
    this.deleteCIData.id = id;
    this.restProvider.deleteCiById(this.loggedUname, this.loggedPass, this.deleteCIData)
      .then(data => {
        this.ciHashedId = data['deleted'];
        this.loader.dismiss();
        this.presentToast('deleted: ');
      })
      .catch(reason => {
        console.log("deleteCoordinatedInspection", reason);
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
      })
  }

  deleteSpecificInspection(id) {
    this.loaderCreate();
    console.log("Function deleteSpecificInspection was called with parameter id=", id);
    this.deleteSIData.id = id;
    this.restProvider.deleteSiById(this.loggedUname, this.loggedPass, this.deleteSIData)
      .then(data => {
        this.ciHashedId = data['deleted'];
        this.loader.dismiss();
        this.presentToast('deleted: ');
      })
      .catch(reason => {
        console.log("deleteSpecificInspection", reason);
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
      })
  }

  getSiForCi(id) {
    console.log(id);
    this.loaderCreate();
    this.ciHashedId = id;
    this.restProvider.getSpecificForCoordinated(this.loggedUname, this.loggedPass, id)
      .then(data => {
        console.info("Data returned for CIID: " + id + " are ", data);
        this.specific = data;
        this.loader.dismiss();
      })
      .catch(reason => {
        console.log("GET SI LIST FOR CI ERROR", reason);
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
      })

  }

  /* full example
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
 */

  openCiReportDownloadNewTab(id){
    window.open("/cide-api/inspection/specific/download/" + id, '_system','location=yes')
  }

  downloadCiReport(id) {
    this.loaderCreate();
    this.restProvider.downloadReportForCi(this.loggedUname, this.loggedPass, id)
      .then(data=>{
        console.info("Downloading report for siid: ", id);
        this.loader.dismiss();
      })
      .catch(reason => {
        console.log("ERROR IN UPLOADING REPORT FOR CI", reason);
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
      })
  }

  uploadCiReport($event,id) : void {
    this.loaderCreate();
    this.file = $event.target.files[0];
    console.log("REPORT TO BE UPLADED FOR SI "+id+": ", this.file);
    this.restProvider.uploadReportForCi(this.loggedUname, this.loggedPass,  $event.target.files[0],id)
      .then(data=>{
        console.log("Report has been sucesfully uploaded for CI: ", data);
        this.ciHashedId = data['updated'];
        this.loader.dismiss();
        this.presentToast('uploaded: ');
      })
      .catch(reason => {
        console.log("ERROR IN UPLOADING REPORT FOR CI", reason);
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
      })

  }
}
