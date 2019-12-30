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
import {FormControl, FormGroup, Validators,ValidatorFn,AbstractControl} from "@angular/forms";
import {AuthenticateProvider} from "../../providers/authenticate/authenticate";
import {error} from "@angular/compiler/src/util";

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
  user: FormGroup;
  userReset: FormGroup;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              public restProvider: RestProvider,
              public authProvider: AuthenticateProvider,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              private toastCtrl: ToastController,
              public alertCtrl: AlertController) {
    this.loaderCreate();
    this.modalType = this.navParams.get('type');
    if (this.modalType === 'editUser') {
      //console.log("USER DATA", this.navParams.get('userData'));
      this.editUserData = this.navParams.get('userData');
      //console.log("EDIT USER DATA: ", this.editUserData);
    }
    if (this.modalType === 'resetUser') {
      //console.log("RESET USER DATA", this.navParams.get('resetUserData'));
      this.resetUserData.uname = (this.navParams.get('resetUserData')).person_username;
      //console.log("RESET USER DATA: ", this.editUserData);
      this.userReset = new FormGroup({
        uname: new FormControl('',[Validators.required]),
        oldPass: new FormControl('',[Validators.required,this.passCheck()]),
        newPass: new FormControl('', [Validators.required]),
        confNewPass: new FormControl('', [Validators.required,this.equalto('newPass')])

      })
    }
    if (this.modalType === 'regUser') {
      //console.log("REGISTER USER DATA", this.navParams.get('regUserData'));
      this.user = new FormGroup({
        uname: new FormControl('',[Validators.required]),
        role:new FormControl('',[Validators.required]),
        password: new FormControl('', [Validators.required]),
        re_password: new FormControl('', [Validators.required,this.equalto('password')])
      });
    }
  }

  private passCheck(): ValidatorFn{
    return (control: AbstractControl):{[key: string]: any} => {
      let input = control.value;
      let isValid=this.loggedPass == input;
      if(!isValid)
        return { 'passCheck': {isValid} };
      else
        return null;
    };
  }

  private equalto(field_name): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

      let input = control.value;

      let isValid=control.root.value[field_name]==input;
      if(!isValid)
        return { 'equalTo': {isValid} };
      else
        return null;
    };
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
    this.getUsers();
  }

  getUsers(){
    this.restProvider.getUser(this.loggedUname,this.loggedPass, this.loggedRole)
      .then(data => {
        this.users = data;
        this.loader.dismiss();
      })
      .catch(reason => {
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
    //console.log("*** Function registerUser was called");
    //console.log("Registration data are: ", this.regUserData);
    this.authProvider.addUser(this.regUserData.uname,this.regUserData.confirm_pass)
      .then(data=>{
        //console.log("Register user response: ", data);
        this.ciHashedId = this.regUserData.uname;
        this.presentToast('Registration succesfull for: ');
        this.wait(2500);
        this.authProvider.addUserRole(this.regUserData.uname,this.regUserData.role)
          .then(data=>{
            //console.log("Added role response: ", data);
            this.loader.dismiss();
            this.ciHashedId = this.regUserData.role;
            this.presentToast('Role assignment sucessfull for: ');
          })
          .catch(reason => {
            //console.log(reason);
            this.loader.dismiss();
            this.presentAlert(reason);
          })
      })
      .catch(reason => {
        if (reason.status == 302 && reason.statusText === 'Found'){
          //console.log("Username already registered in authentication service. Adding role.", reason.status, reason.statusText);
          this.ciHashedId = '';
          this.presentToast('Username already registered. Adding role...');
          this.wait(2500);
          this.authProvider.addUserRole(this.regUserData.uname,this.regUserData.role)
            .then(data=>{
              //console.log("Added role response: ", data);
              this.loader.dismiss();
              this.ciHashedId = this.regUserData.role;
              this.presentToast('Role assignment sucessfull for: ');
            })
            .catch(reason => {
              //console.log(reason);
              this.loader.dismiss();
              this.presentAlert(reason);
            })
        }
        else{
          //console.log(reason);
          this.loader.dismiss();
          this.presentAlert(reason);
          //this.navCtrl.push('UserPage')
        }
      })
  }

  resetUserPassword(){
    //console.log("*** Function resetUserPassword was called");
    this.authProvider.changeUserPassword(this.resetUserData.uname,this.resetUserData.confirmNewPass)
      .then(data=>{
        this.ciHashedId = this.resetUserData.uname;
        //this.loggedPass == this.resetUserData.confirmNewPass;
        //localStorage.setItem('app.userInfo.pass', this.resetUserData.confirmNewPass);
        //this.loggedPass = localStorage.getItem('app.userInfo.pass');
        this.presentToast('Password succesfully updated for: ');
        })
      .catch(reason=>{
        //console.log(reason);
        this.loader.dismiss();
        this.presentAlert(reason);
      })
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
    //console.log("*** Function updateUserMetadata user was called");
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

  wait(ms){
    let start = new Date().getTime();
    let end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
  }

}
