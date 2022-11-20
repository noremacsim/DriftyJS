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
    return this.getRequest('/user');
  }

  async login(username: '', password: '')
  {
    return this.postRequest('/user/login', {username: username, password: password});
  }

  async validate2Fa(token: '')
  {
    return this.postRequest('/user/2fa/validate', {token: token});
  }

  async loadFeed()
  {
    return await this.getRequest('/posts/feed');
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
}
