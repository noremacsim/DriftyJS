import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ApiService } from '../../services/api.service';
import { StorageService } from '../../services/storage.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: FormGroup | any;

  constructor(
    private navCtrl: NavController,
    private apiService: ApiService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.user = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  public submitData(){
    const username = this.user.value.username;
    const password = this.user.value.password;

    this.apiService.login(username, password)
      .then(async (data: any) => {
        console.log(data);
        await this.storage.set('jwt', data?.jwt);
        this.navCtrl.navigateRoot('/');
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
