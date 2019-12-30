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
  baseUrl: any;
  //authUrl = 'http://192.168.1.226/bifisic/services/httpbasicauth/auth';
  //authUrl = 'https://pproo.azo.hr/bifisic/services/httpbasicauth/auth';
  constructor(public http: HttpClient) {
    //console.log('Hello AuthenticateProvider Provider');
    this.baseUrl = '/cide-auth';
    //this.baseUrl = 'https://pproo.azo.hr/bifisic/services/httpbasicauth'
  }

  /**
   * Store user on local storage.
   *
   * @param user User.
   */
  private setAuthenticatedUser(user: any, pass: any, lang: any) {
    if (user != null) {
      localStorage.setItem('app.userInfo', 'true');
      localStorage.setItem('app.userInfo.role', user.roles);
      localStorage.setItem('app.userInfo.name', user.name);
      localStorage.setItem('app.userInfo.pass', pass);
      localStorage.setItem('app.userInfo.lang', lang);
    }
    else {
      //console.error("Authentication service is not available");
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
        id: localStorage.getItem('app.userInfo.role'),
        name: localStorage.getItem('app.userInfo.name')
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
    localStorage.removeItem('app.userInfo.pass');
    localStorage.removeItem('app.userInfo.lang');

    localStorage.clear();
    window.localStorage.clear();
  }

  /**
   * Perform authentication using credentials.
   *
   * @param user Username.
   * @param password Password.
   */

  public authenticateUsingCredentials(user: string, password: string, language: string) {
    if (user === null || password === null) {
      return Observable.create('User and password are required')
    }
    else {
      return new Promise((resolve, reject) => {
        this.http.get(this.baseUrl + '/auth?user=' + user + '&password=' + password).subscribe(data => {
          this.setAuthenticatedUser(data, password, language);
          resolve(data)
        }, error1 => {
          //console.log(error1);
          reject(error1)
        })
      })
    }
  }

  public addXXXUser(uname: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + '/adduser?user=' + uname + '&password=' + password).subscribe(data => {
        resolve(data)
      }, error1 => {
        reject(error1)
      })
    })
  }

  public addUser(uname: string, password: string) {
    return new Promise((resolve, reject) =>{
      this.http.get(this.baseUrl + '/adduser?user=' + uname + '&password=' + password, {observe: 'response'}).subscribe(res => {
        resolve(res);
      }, error1 => {
        reject(error1)
      })
    })
  }

  public addUserRole(uname: string, role: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + '/addrole?user=' + uname + '&role=' + role).subscribe(data => {
        console.log("User sucessfully added to BIFISIC auth service with data:  ", data);
        resolve(data)
      }, error => {
        console.log(error);
        reject(error)
      })
    })
  }

  private deleteUserRole(uname: string, role: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + '/deleterole?user=' + uname + '&role=' + role).subscribe(data => {
        console.log("User sucessfully added to BIFISIC auth service with data:  ", data);
        resolve(data)
      }, error => {
        console.log(error);
        reject(error)
      })
    })
  }


  private deleteUser(uname: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + '/deleteuser?user=' + uname).subscribe(data => {
        console.log("User sucessfully added to BIFISIC auth service with data:  ", data);
        resolve(data)
      }, error => {
        console.log(error);
        reject(error)
      })
    })
  }

  private listRolesUser(uname: string, role: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + '/listroles?user=' + uname).subscribe(data => {
        console.log("User sucessfully added to BIFISIC auth service with data:  ", data);
        resolve(data)
      }, error => {
        console.log(error);
        reject(error)
      })
    })
  }


  public changeUserPassword(uname: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + '/edituser?user=' + uname + '&password=' + password).subscribe(data => {
        console.log("User sucessfully edited in BIFISIC auth service with data:  ", data);
        resolve(data)
      }, error => {
        console.log(error);
        reject(error)
      })
    })
  }





}


