import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams, ToastController,
  ViewController
} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  users:any;
  loader: any;
  loggedUname : string = localStorage.getItem('app.userInfo.name');
  loggedPass: string = localStorage.getItem('app.userInfo.pass');
  loggedRole: string = localStorage.getItem('app.userInfo.role');
  selectedLanguage: string = localStorage.getItem('app.userInfo.lang');
  ciHashedId: any;
  regUserData = {"uname": '', "pass": "","confirm_pass":"","role":""};
  resetUserData = {"uname": '', "oldPass": "","newPass":"","confirmNewPass":""};
  //editUserData = {"id":"","name": '', "surname": "","email":"","username":"","role":"","type":""};
  editUserData: any;
  //resetUserData: any;
  modalType: string = null;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              public restProvider: RestProvider,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              private toastCtrl: ToastController,
              public alertCtrl: AlertController) {
    this.loaderCreate();
    this.modalType = this.navParams.get('type');
    if (this.modalType === 'editUser') {
      console.log("USER DATA", this.navParams.get('userData'));
      this.editUserData = this.navParams.get('userData');
      console.log("EDIT USER DATA: ", this.editUserData);
    }
    if (this.modalType === 'resetUser') {
      console.log("RESET USER DATA", this.navParams.get('resetUserData'));
      this.resetUserData.uname = (this.navParams.get('resetUserData')).person_username;
      console.log("RESET USER DATA: ", this.editUserData);
    }

  }

  presentAlert(reason) {
    const alert = this.alertCtrl.create({
      title: reason.name,
      subTitle: reason.message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
    this.getUsers();
  }

  getUsers(){
    this.restProvider.getUser(this.loggedUname,this.loggedPass)
      .then(data => {
        this.users = data;
        this.loader.dismiss();
      })
      .catch(reason => {
        //console.log("GET ESTABLISHMENT LIST FAILED", reason);
        this.loader.dismiss();
        this.presentAlert(reason);
        this.navCtrl.push('HomePage')
      })
  }

  regUserModal(){
    let modalData: { username: string, password: string, enabled: boolean, type: any } =
      {"username": "", "password": "reqUser", "enabled": true, "type": "regUser"};
    let modalPage = this.modalCtrl.create('UserPage', modalData, {cssClass: "modal-fullscreen"});
    modalPage.present();
  }

  registerUser(){
    console.log("*** Function registerUser was called");
    console.log("Registration data are: ", this.regUserData);
  }

  resetUserPassword(){
    console.log("*** Function resetUserPassword was called");
    console.log("Reset data are: ", this.resetUserData);
  }

  editUserModal(data){
    let modalData: { type: any, userData: any } = {
      type: "editUser",
      userData: data
    };
    let modalPage = this.modalCtrl.create('UserPage', modalData, {cssClass: "modal-fullscreen"});
    modalPage.present();
  }

  resetUserModal(data){
    let modalData: { type: any, resetUserData: any } = {
      type: "resetUser",
      resetUserData: data
    };
    let modalPage = this.modalCtrl.create('UserPage', modalData, {cssClass: "modal-fullscreen"});
    modalPage.present();
  }

  updateUserMetadata(){
    console.log("*** Function updateUserMetadata user was called");
    console.log("Metadata to update are: ", this.editUserData);
    this.loaderCreate();
    this.restProvider.updateUser(this.loggedUname,this.loggedPass,this.editUserData)
      .then(data => {
        this.loader.dismiss();
        this.ciHashedId = data['updated'];
        this.presentToast('Updated user id: ');
      })
      .catch(reason => {
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
      })
  }


  showConfirmAlert(id,uname) {
    const confirmAlert = this.alertCtrl.create({
      title: 'Confirm delete user',
      message: 'Are you sure you want to permanently delete this user?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log("Here we need to add methods to delete user from cide database and from geoserver");
            this.navCtrl.push('UserPage');
          }
        }
      ]
    });
    confirmAlert.present();
  }

  loaderCreate() {
    this.loader = this.loadingCtrl.create({
      content: '',
      spinner: 'dots',
      cssClass: 'customLoader'
    });
    this.loader.present();
  }

  public closeModal() {
    this.viewCtrl.dismiss();
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

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message + this.ciHashedId,
      duration: 2000,
      position: 'center'
    });

    if (this.ciHashedId != 0) {
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
        this.closeModal();
        this.navCtrl.push('UserPage');
        //this.navCtrl.popAll();
      });
    }
    toast.present();
  }

}
