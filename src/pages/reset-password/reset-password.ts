import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  resetUserPassData = {"uname": '', "email": ""};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translateService: TranslateService) {
  }

  openLoginPage(){
    this.navCtrl.push('LoginPage')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  requestPassword(data){
    console.log("Reset password was send with data: ", data);
    alert("Comming soon ...");

  }

}
