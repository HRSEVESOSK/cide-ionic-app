import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {p} from "@angular/core/src/render3";
import {error} from "@angular/compiler-cli/src/transformers/util";



/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  uname: any;
  upass: any;
  apiUrl: any;

  constructor(public http: HttpClient) {
    this.apiUrl = 'http://localhost:5001/api';
  }

 /*
  login(u, p) {
    return new Promise((resolve, reject) => {
      this.http.get(this.authUrl + '?user=' + u + '&password=' + p).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log(error1);
        reject(error1);
      })
    })
  }
  */


  getEstablishment(u, p) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/establishment', {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log(error1);
        reject(error1);

      })
    })
  }

  getSpecificForCoordinated(u, p, ciId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/inspection/specific/' + ciId, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log(error1);
        reject(error1);

      })
    })
  }

  getCiForEstablishment(u, p, estabId) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/inspection/' + estabId, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log(error1)
      })
    })
  }

  getInspectionSpecificType(u, p) {
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl + '/inspection/specific/type', {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log("ERROR IN GETTING SI TYPES FROM API", error1);
        reject(error1)
      })
    })
  }

  getInspectionSpecificCriterior(u, p) {
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl + '/inspection/specific/criterior', {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log("ERROR IN GETTING SI TYPES FROM API", error1);
        reject(error1)
      })
    })
  }

  getInspectionSpecificCriteriorScore(u, p) {
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl + '/inspection/specific/criterior/score', {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log("ERROR IN GETTING SI TYPES FROM API", error1);
        reject(error1)
      })
    })
  }



  insertCiForEstablishment(u, p, data) {
    return new Promise((resolve, reject) => {
      console.log(data);
      this.http.post(this.apiUrl + '/inspection/insert', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log("ERROR IN INSERTING CI", error1);
        reject(error1)
      })
    })
  }

  updateCiForEstablishment(u, p, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/inspection/update', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log("ERROR IN UPDATING CI", error1);
        reject(error1)
      })
    })
  }

  updateCiCriteriaScore(u, p, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/specific/criterior/insert', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log("ERROR IN UPDATING CI", error1);
        reject(error1)
      })
    })
  }

  deleteCiById(u,p,data){
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/inspection/delete', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log("ERROR IN DELETING CI", error1);
        reject(error1)
      })
    })
}

  deleteSiById(u,p,data){
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/inspection/specific/delete', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log("ERROR IN DELETING CI", error1);
        reject(error1)
      })
    })
  }

    uploadReportForCi(u, p, file:Blob, id) {
      let formData = new FormData();
      formData.append('file', file, 'Report_' + id  + new Date().toJSON().split('T')[0]+ '.pdf');
      let httpOptions = {
        headers: new HttpHeaders({
          'enctype': 'multipart/form-data; boundary=----WebKitFormBoundaryuL67FWkv1CA',
          'Authorization':'Basic ' + btoa(u + ':' + p)})
      };
    return new Promise((resolve, reject) => {
      console.log(file);
      this.http.post(this.apiUrl + '/inspection/specific/upload', formData, httpOptions).subscribe(data => {
        resolve(data)
      }, error1 => {
        console.log("ERROR IN INSERTING UPLOADING REPORT FOR CI", error1);
        reject(error1)
      })
    })
  }
  /*
  postFile(token:string, file:Blob){

    let url = WebService.API_POST_FILE + "?token="+token;
    let httpOptions = {
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data; boundary=----WebKitFormBoundaryuL67FWkv1CA'
      })
    };

    let formData = new FormData();
    formData.append('file', file, 'test.jpg');

    console.log("post photo to URL at "+url);
    return this.http
      .post<SimpleResponse>(
        url,
        formData,
        httpOptions
      );
  }
  */


}
