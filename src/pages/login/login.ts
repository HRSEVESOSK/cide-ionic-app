import {Component, ɵEMPTY_ARRAY} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider} from "../../providers/rest/rest";
import {AuthenticateProvider} from "../../providers/authenticate/authenticate";
import {HomePage} from "../home/home";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'CIDE Login',
  segment: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private username: string;
  private password: string;
  rolesArray: any;
  private error: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restProvider: RestProvider,
              public authenticateProvider: AuthenticateProvider) {

  }

  public login(): void {
    if (this.username && this.password){
      this.authenticateProvider.authenticateUsingCredentials(this.username,this.password)
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