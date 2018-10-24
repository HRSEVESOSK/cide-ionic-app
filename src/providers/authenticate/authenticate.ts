import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the AuthenticateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticateProvider {
  //authUrl = 'http://192.168.1.226/bifisic/services/httpbasicauth/auth';
  //authUrl = 'http://pproo.azo.hr/bifisic/services/httpbasicauth/auth';
  authUrl = '/cide-auth';
  constructor(public http: HttpClient) {
    console.log('Hello AuthenticateProvider Provider');
  }
  /**
   * Store user on local storage.
   *
   * @param user User.
   */
  private setAuthenticatedUser(user: any, pass: any) {
    if (user != null) {
      localStorage.setItem('app.userInfo', 'true');
      localStorage.setItem('app.userInfo.role', user.roles);
      localStorage.setItem('app.userInfo.name', user.name);
      localStorage.setItem('app.userInfo.pass', pass);
    }
  }
  /**
   * Get user from local storage.
   *
   * @return User.
   */
  public getAuthenticatedUser(): any {
    let user: any;
    if (localStorage.getItem('app.userInfo')) {
      user = {
        id : localStorage.getItem('app.userInfo.role'),
        name : localStorage.getItem('app.userInfo.name')
      }
    }
    return user;
  }
  /**
   * Remove user from local storage.
   */
  public clearAuthenticatedUser(): void {
    localStorage.removeItem('app.userInfo');
    localStorage.removeItem('app.userInfo.role');
    localStorage.removeItem('app.userInfo.name');
  }

  /**
   * Perform authentication using credentials.
   *
   * @param user Username.
   * @param password Password.
   */

  public authenticateUsingCredentials(user: string,password: string){
    if (user === null || password === null){
      return Observable.create('User and password are required')
    }
    else{
      return new Promise((resolve, reject) => {
        this.http.get(this.authUrl + '?user=' + user + '&password=' + password).subscribe(data=> {
          this.setAuthenticatedUser(data,password)
          resolve(data)
        },error1 => {
          console.log(error1)
          reject(error1)
        })
      })
    }
  }

}
