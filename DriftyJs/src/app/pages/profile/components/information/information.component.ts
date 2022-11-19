import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

//import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'information-view',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent implements OnInit {

  friends: any;

  constructor(
    private router: Router,
    //private apiService: ApiService
  ) { }

  ngOnInit() {
    this.loadFriends();
  }

  loadFriends() {
    this.friends = {
      "id":1,
      "name":"Minnie Harvey",
      "avatar":"https://randomuser.me/api/portraits/women/2.jpg",
      "is_online":true,
      "feed_image":"https://via.placeholder.com/600/d32776",
      "description":"Keep it simple",
      "last_message":{
        "text":"Hey when are you going?",
        "time":"9:45 AM"
      },
      "message_count":3,
      "notification_message":{
        "text":"Likes your photos",
        "time":"10 min ago"
      }
    },
      {
        "id":2,
        "name":"Claire Fisher",
        "avatar":"https://randomuser.me/api/portraits/women/81.jpg",
        "is_online":true,
        "feed_image":"https://via.placeholder.com/600/524931",
        "description":"Keep it simple",
        "last_message":{
          "text":"I would love to take a trip with you soon.",
          "time":"9:40 AM"
        },
        "message_count":1,
        "notification_message":{
          "text":"Just mentioned you",
          "time":"10 min ago"
        }
      },
      {
        "id":3,
        "name":"Brennan Holmes",
        "avatar":"https://randomuser.me/api/portraits/men/79.jpg",
        "is_online":false,
        "feed_image":"https://via.placeholder.com/600/24f355",
        "description":"Keep it simple",
        "last_message":{
          "text":"Sure, lets do it.",
          "time":"9:00 AM"
        },
        "notification_message":{
          "text":"Likes your photos",
          "time":"10 min ago"
        }
      },
      {
        "id":4,
        "name":"Cameron Mitchelle",
        "avatar":"https://randomuser.me/api/portraits/men/27.jpg",
        "is_online":false,
        "feed_image":"https://via.placeholder.com/600/771796",
        "description":"Keep it simple",
        "last_message":{
          "text":"Yes, it was an amazing experience.",
          "time":"8:59 AM"
        },
        "notification_message":{
          "text":"Just mentioned you",
          "time":"10 min ago"
        }
      },
      {
        "id":5,
        "name":"Isobel Kim",
        "avatar":"https://randomuser.me/api/portraits/women/92.jpg",
        "is_online":false,
        "feed_image":"https://via.placeholder.com/600/92c952",
        "description":"Keep it simple",
        "last_message":{
          "text":"Hey, can i hear your voice?",
          "time":"8:55 AM"
        },
        "notification_message":{
          "text":"Likes your photos",
          "time":"10 min ago"
        }
      },
      {
        "id":6,
        "name":"Zoe Stevens",
        "avatar":"https://randomuser.me/api/portraits/women/17.jpg",
        "is_online":true,
        "feed_image":"https://via.placeholder.com/600/56a8c2",
        "description":"Keep it simple",
        "last_message":{
          "text":"Lol... Can't wait to do it again",
          "time":"8:50 AM"
        },
        "notification_message":{
          "text":"Just mentioned you",
          "time":"10 min ago"
        }
      },
      {
        "id":7,
        "name":"Alberto Shaw",
        "avatar":"https://randomuser.me/api/portraits/men/0.jpg",
        "is_online":false,
        "feed_image":"https://via.placeholder.com/600/b0f7cc",
        "description":"Keep it simple",
        "last_message":{
          "text":"See you soon.",
          "time":"8:47 AM"
        },
        "notification_message":{
          "text":"Likes your photos",
          "time":"10 min ago"
        }
      },
      {
        "id":8,
        "name":"Gilbert Bates",
        "avatar":"https://randomuser.me/api/portraits/men/7.jpg",
        "is_online":true,
        "feed_image":"https://via.placeholder.com/600/1ee8a4",
        "description":"Keep it simple",
        "last_message":{
          "text":"Arsenal sucks!",
          "time":"8:30 AM"
        },
        "notification_message":{
          "text":"Just mentioned you",
          "time":"10 min ago"
        }
      },
      {
        "id":9,
        "name":"Bessie Bryant",
        "avatar":"https://randomuser.me/api/portraits/women/95.jpg",
        "is_online":false,
        "feed_image":"https://via.placeholder.com/600/51aa97",
        "description":"Keep it simple",
        "last_message":{
          "text":"When are you going?",
          "time":"8:15 AM"
        },
        "notification_message":{
          "text":"Likes your photos",
          "time":"10 min ago"
        }
      },
      {
        "id":10,
        "name":"Kelly Gomez",
        "avatar":"https://randomuser.me/api/portraits/men/61.jpg",
        "is_online":true,
        "feed_image":"https://via.placeholder.com/600/810b14",
        "description":"Keep it simple",
        "last_message":{
          "text":"Cristiano Ronaldo is doing well with Juventus.",
          "time":"8:00 AM"
        },
        "notification_message":{
          "text":"Just mentioned you",
          "time":"10 min ago"
        }
      };
    // this.apiService.getFriends().then(result => {
    //     // console.log('getFriends result', result);
    //     this.friends = result;
    // }).catch(error => {
    //     console.log('getFriends error', error);
    // });
  }

  openChat(user: any) {
    let navigationExtras: NavigationExtras = {
      state: { user }
    };
    this.router.navigate([`tabs/inbox/${user.id}`], navigationExtras);
  }

}
