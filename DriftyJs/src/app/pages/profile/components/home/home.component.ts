import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

//import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'profileHome-view',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  friends: any;

  constructor(
    private router: Router,
    //private apiService: ApiService
  ) { }

  ngOnInit() {
  }


  openChat(user: any) {
    let navigationExtras: NavigationExtras = {
      state: { user }
    };
    this.router.navigate([`tabs/inbox/${user.id}`], navigationExtras);
  }

}
