import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  feed: any;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.loadFeed();
  }

  loadFeed() {
    this.feed = {}
    this.apiService.loadFeed().then(result => {
      console.log(result);
         this.feed = result;
    }).catch(error => {
         console.log('loadFeed error', error);
    });
  }

}
