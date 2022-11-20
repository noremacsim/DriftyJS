import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {StorageService} from "../../services/storage.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-twofa',
  templateUrl: './twofa.page.html',
  styleUrls: ['./twofa.page.scss'],
})
export class TwofaPage implements OnInit {
  twoFA: FormGroup | any;

  constructor(
    private navCtrl: NavController,
    private apiService: ApiService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.twoFA = new FormGroup({
      token: new FormControl('', Validators.required),
    });
  }

  public submitData(){
    const token = this.twoFA.value.token;

    this.apiService.validate2Fa(token)
      .then(async (data: any) => {
        this.navCtrl.navigateRoot('/');
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
