import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return await this.checkAuth();
  }

  private async checkAuth() {
    return this.apiService.checkLogin()
      .then((data) => {
        return true;
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 403) {
          return this.routeToTwoFA();
        } else {
          return this.routeToLogin();
        }
      });
  }

  private routeToLogin(): boolean {
    this.navCtrl.navigateRoot('/login');
    return false;
  }

  private routeToTwoFA(): boolean {
    this.navCtrl.navigateRoot('/twofa');
    return false;
  }

}
