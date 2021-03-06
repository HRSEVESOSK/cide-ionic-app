import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {AuthenticateProvider} from "../../providers/authenticate/authenticate";
import { TranslateService } from '@ngx-translate/core';
import {ResetPasswordPage} from "../reset-password/reset-password";
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
  public lang: string;
  rolesArray: any;
  error: string;

  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              public authenticateProvider: AuthenticateProvider,
              public translateService: TranslateService) {
    this.lang = 'hr';

  }

  public login(): void {
    if (this.username && this.password){
      this.authenticateProvider.authenticateUsingCredentials(this.username,this.password,this.lang)
        .then(data => {
          this.rolesArray = data.roles;
          //console.log(this.rolesArray);
          if (this.rolesArray){
            this.navCtrl.setRoot('HomePage')
          }
        })
        .catch(reason => {
          //console.log("WE ARE HERE", reason);
          this.error = reason.error;
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

  changeLanguage(){
    if (this.lang == 'en'){
      this.lang = 'hr';
    }
    else{
      this.lang = 'en';
    }
    this.translateService.use(this.lang);
    localStorage.setItem('app.userInfo.lang',this.lang);
    //console.log("Changing language to", this.lang)
  }

  openResetPasswordPage(){
    this.navCtrl.push('ResetPasswordPage')
  }
}
