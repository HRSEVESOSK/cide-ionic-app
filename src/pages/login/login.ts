import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {AuthenticateProvider} from "../../providers/authenticate/authenticate";
//import {HomePage} from "../home/home";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  templateUrl: 'login.html',
})
export class LoginPage {
  private username: string;
  private password: string;
  rolesArray: any;
  error: string;

  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              public authenticateProvider: AuthenticateProvider) {

  }

  public login(): void {
    if (this.username && this.password){
      this.authenticateProvider.authenticateUsingCredentials(this.username,this.password)
        .then(data => {
          this.rolesArray = data.roles;
          console.log(this.rolesArray);
          if (this.rolesArray){
            this.navCtrl.setRoot('HomePage')
          }
        })
        .catch(reason => {
          console.log("WE ARE HERE", reason);
          this.error = reason.error
          this.presentErrorMessage("BIFISIC austhentication service is currently unavailable with status: " + reason.status + ": " + reason.statusText);
        })
    }
  }

  presentErrorMessage(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'center'
    });
    toast.present();
  }



  /*
  public login(): void{
    if (this.username && this.password){
      this.restProvider.login(this.username,this.password)
        .then(data => {
          this.rolesArray = data.roles;
          console.log(this.rolesArray)
          if (this.rolesArray){
            this.navCtrl.setRoot(HomePage)
          }
        })
        .catch(reason => {
          console.log("WE ARE HERE", reason);
          this.error = reason.error
        })

    }
  }
  */

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }

}
