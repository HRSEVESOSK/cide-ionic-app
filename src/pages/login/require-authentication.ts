import { OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthenticateProvider } from '../../providers/authenticate/authenticate';
//import { LoginPage} from "./login";

/**
 * Superclass that must be extended by pages with login required.
 */
export class RequireAuthenticationPage implements OnInit {
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticateProvider: AuthenticateProvider) {

  }

  /**
   * Logout user.
   */
  public logout(): any {
    this.authenticateProvider.clearAuthenticatedUser();
    this.navCtrl.setRoot('LoginPage');
  }

  /**
   * Post-constructor.
   */
  ngOnInit(): void {
    // Check if user are logged in.
    if (this.authenticateProvider.getAuthenticatedUser() != null) {
      // Logged in!
      console.log('Call aa!');
      console.log(this.authenticateProvider.getAuthenticatedUser());
    } else {
      // If the current page isn't AuthenticatePage, redirects to AuthenticatePage.
      if (this.navCtrl.getActive().component != 'LoginPage') {
        this.navCtrl.setRoot('LoginPage');
      }
    }
  }

}
