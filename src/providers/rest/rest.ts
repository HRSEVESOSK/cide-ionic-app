import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RestProvider {
  apiUrl: any;

  constructor(public http: HttpClient) {
    //this.apiUrl = 'http://localhost:5001/api';
    //this.apiUrl = 'http://192.168.1.226/cide-api/api';
    //this.apiUrl = '/cide-api';
    this.apiUrl = 'https://pproo.azo.hr/cide-api/api';

  }
 getEstablishment(u, p) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/establishment', {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log(error1);
        reject(error1);

      })
    })
  }
  getSpecificForCoordinated(u, p, ciId,lang) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/inspection/specific/' + ciId + "?lang="+lang, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log(error1);
        reject(error1);

      })
    })
  }

  getCiForEstablishment(u, p, estabId) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/inspection/' + estabId, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log(error1)
      })
    })
  }


  getScoreForSI(u,p,siId){
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl + '/inspection/specific/score/' + siId,{headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data=>{
        resolve(data)
      }, error1 => {
        //console.error('Error in getting score values from API for SI', siId);
        reject(error1);
      })
    })
  }

  getInspectionSpecificIssues(u,p, siId){
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl + '/inspection/specific/issue/' + siId, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("error in getInspectionSpecificIssues: ", error1);
        reject(error1)
      })
    })
  }

  getInspectionSpecificType(u, p,type,lang) {
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl + '/inspection/specific/type?type='+type+'&lang='+lang, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("error in getInspectionSpecificType: ", error1);
        reject(error1)
      })
    })
  }

  getInspectionSpecificCriterior(u, p,lang) {
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl + '/inspection/specific/criterior?lang='+lang, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN GETTING SI TYPES FROM API", error1);
        reject(error1)
      })
    })
  }


  getSICriteriorScoreList(u, p,lang) {
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl + '/inspection/specific/criterior/score?lang='+lang, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN GETTING SI TYPES FROM API", error1);
        reject(error1)
      })
    })
  }



  insertCiForEstablishment(u, p, data) {
    return new Promise((resolve, reject) => {
      //console.log(data);
      this.http.post(this.apiUrl + '/inspection/insert', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN INSERTING CI", error1);
        reject(error1)
      })
    })
  }

  updateCiForEstablishment(u, p, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/inspection/update', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN UPDATING CI", error1);
        reject(error1)
      })
    })
  }

  updateCiCriteriaScore(u, p, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/inspection/specific/criterior/insert', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN UPDATING CI", error1);
        reject(error1)
      })
    })
  }

  updateCiIssues(u, p, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/inspection/specific/issue/insert', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN UPDATING CI", error1);
        reject(error1)
      })
    })
  }

  deleteCiById(u,p,data){
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/inspection/delete', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN DELETING CI", error1);
        reject(error1)
      })
    })
}

  deleteSiById(u,p,data){
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/inspection/specific/delete', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN DELETING CI", error1);
        reject(error1)
      })
    })
  }

    downloadReportForCi(u,p,id){
      return new Promise((resolve,reject) =>{
        this.http.get(this.apiUrl + '/inspection/specific/download/' + id,{headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(reportFile => {
          resolve(reportFile)
        }, error1 => {
          //console.log("ERROR IN DOWNLOADING THE REPORT", error1);
          reject(error1)
        })
      })
    }

    uploadReport(u, p, file:Blob, id,inspectionType) {
      let uploadURLpath = '';
      if (inspectionType == 'CI') {
        uploadURLpath = '/inspection/upload'
      }
      if (inspectionType == 'SI') {
        uploadURLpath = '/inspection/specific/upload'
      }
      //console.log("URL PATH IS: ", uploadURLpath);
      let formData = new FormData();
      //formData.append('file', file, 'Report_' + id  + '_' + new Date().toJSON().split('T')[0]+ '.pdf');
      formData.append('file', file);
      formData.append('id',id);
      let httpOptions = {
        headers: new HttpHeaders({
          'enctype': 'multipart/form-data; boundary=----WebKitFormBoundaryuL67FWkv1CA',
          'Authorization':'Basic ' + btoa(u + ':' + p)})
      };
    return new Promise((resolve, reject) => {
      //console.log(file);
      this.http.post(this.apiUrl + uploadURLpath, formData, httpOptions).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN INSERTING UPLOADING REPORT FOR " + inspectionType, error1);
        reject(error1)
      })
    })
  }

  getUser(u, p, role) {
    let reqUrl = '';
    if (role == 'ROLE_CIDE_ADMIN'){
      reqUrl = this.apiUrl + '/user'
    }
    else{
      reqUrl = this.apiUrl + '/user?uname=' + u;
    }
    return new Promise((resolve, reject) => {
      this.http.get(reqUrl, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p))}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log(error1);
        reject(error1);

      })
    })
  }

  updateUser(u,p,data){
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/user/update', data, {headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(u + ':' + p)).set('charset','UTF-8')}).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN UPDATING CI", error1);
        reject(error1)
      })
    })
  }

  sendResetEmail(data){
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/public/reset-password' + '?uname='+data.uname +'&email='+data.email ).subscribe(data => {
        resolve(data)
      }, error1 => {
        //console.log("ERROR IN UPDATING CI", error1);
        reject(error1)
      })
    })
  }
}
