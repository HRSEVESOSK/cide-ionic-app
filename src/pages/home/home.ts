import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {Platform} from "ionic-angular";
import {AuthenticateProvider} from "../../providers/authenticate/authenticate";
import {RequireAuthenticationPage} from "../login/require-authentication";
//import {EstablishmentPage} from "../establishment/establishment";
import {IonicPage} from "ionic-angular/umd";

@IonicPage()
@Component({
  templateUrl: 'home.html'
})
export class HomePage extends RequireAuthenticationPage{
  /*
  private rootPage;
  private homePage;
  private estabPage;
  */
  loggedUser: any;
  loggedRoles: any;
  constructor(public navCtrl: NavController,
              splashScreen: SplashScreen,
              statusBar: StatusBar,
              platform: Platform,
              public authenticationProvider: AuthenticateProvider,
              public navParams: NavParams) {
    super(navCtrl, navParams, authenticationProvider)
    this.loggedRoles =localStorage.getItem('app.userInfo.role');
    this.loggedUser = localStorage.getItem('app.userInfo.name');
    /*
    this.rootPage = HomePage;
    this.homePage = HomePage;
    this.estabPage = 'EstablishmentPage';
    */
    /*
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    */
  }
  //OPENING PAGES FROM MENU
  openEstabPage(){
    this.navCtrl.push('EstablishmentPage')
  }



}
