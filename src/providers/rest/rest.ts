import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {p} from "@angular/core/src/render3";



/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  uname: any;
  upass: any;


  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }
  apiUrl = 'http://localhost:5001/api'
  authUrl = 'http://192.168.1.226/bifisic/services/httpbasicauth/auth'

  login(u,p){
    return new Promise((resolve, reject) => {
      this.http.get(this.authUrl + '?user=' + u + '&password=' + p).subscribe(data=> {
        resolve(data)
      },error1 => {
        console.log(error1)
        reject(error1)
      })
    })
  }



  getEstablishment(u,p){
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/establishment',{headers:new HttpHeaders().set('Authorization', 'Basic ' + btoa(u+':'+p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log(error1)
      })
    })
  }

  getCiForEstablishment(u,p,estabId){
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/inspection/' + estabId,{headers:new HttpHeaders().set('Authorization', 'Basic ' + btoa(u+':'+p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log(error1)
      })
    })
  }

}
