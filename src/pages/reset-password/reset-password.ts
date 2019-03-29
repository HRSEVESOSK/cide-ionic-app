import { Component,NgZone  } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {RestProvider} from "../../providers/rest/rest";

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
  loader:any;
  private captchaPassed: boolean = false;
  private captchaResponse: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translateService: TranslateService,
              public restProvider: RestProvider,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private zone: NgZone) {
  }

  openLoginPage(){
    this.navCtrl.push('LoginPage')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  requestPassword(data){
    this.loaderCreate();
    console.log("Reset password was send with data: ", data);
    this.restProvider.sendResetEmail(data)
      .then(data=>{
        this.presentToast(data);
        this.loader.dismiss();
      })
      .catch(reason => {
        this.loader.dismiss();
        this.presentErrorMessage(reason.status + ": " + reason.statusText);
      })
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'center'
    });
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
        this.navCtrl.push('LoginPage');
        //this.navCtrl.popAll();
      });
    toast.present();
  }

  presentErrorMessage(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'center'
    });
    toast.onDidDismiss(() => {
      this.navCtrl.push('LoginPage');
    });
    toast.present();
  }

  loaderCreate() {
    this.loader = this.loadingCtrl.create({
      content: '',
      spinner: 'dots',
      cssClass: 'transparent'
    });
    this.loader.present();
  }

  captchaResolved(response: string): void {

    this.zone.run(() => {
      this.captchaPassed = true;
      this.captchaResponse = response;
    });

  }

}
