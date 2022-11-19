import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: string = 'http://localhost:4101';

  constructor(
    private httpClient: HttpClient,
    public storage: StorageService,
  ) {}

  async checkLogin() {
    return await this.getRequest('/user');
  }

  async login(username: '', password: '')
  {
    return this.postRequest('/user/login', {username: username, password: password});
  }

  async validate2Fa(token: '')
  {
    return this.postRequest('/user/2fa/validate', {token: token});
  }

  async getRequest(path: any) {

    const authToken = await this.storage.get('jwt');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    })

    return this.httpClient.get(`${this.baseUrl}${path}`, { headers: headers }).toPromise();
  }

  async postRequest(path: any, data = {}) {

    const authToken = await this.storage.get('jwt');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    })

    return this.httpClient.post(`${this.baseUrl}${path}`, data, { headers: headers }).toPromise();
  }

  // getSampleData() {
  //   let promise = new Promise((resolve, reject) => {
  //     this.http.get(`${this.baseUrl}`)
  //         .toPromise()
  //         .then(res => {
  //             resolve(res);
  //         }, error => {
  //             reject(error);
  //         });
  //   });
  //   return promise;
  // }

  // getFriends() {
  //   let promise = new Promise((resolve, reject) => {
  //       this.http.get(`${this.baseUrl}`)
  //           .toPromise()
  //           .then(res => {
  //               let data:any = res['friends'];
  //               resolve(data);
  //           }, error => {
  //               reject(error);
  //           });
  //   });
  //   return promise;
  // }

  // getGroups() {
  //   let promise = new Promise((resolve, reject) => {
  //       this.http.get(`${this.baseUrl}`)
  //           .toPromise()
  //           .then(res => {
  //               let data:any = res['groups'];
  //               resolve(data);
  //           }, error => {
  //               reject(error);
  //           });
  //   });
  //   return promise;
  // }

}
