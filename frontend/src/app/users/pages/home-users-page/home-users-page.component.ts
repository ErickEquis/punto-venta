import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-users-page',
  templateUrl: './home-users-page.component.html',
  styleUrls: ['./home-users-page.component.css']
})
export class HomeUsersPageComponent implements OnInit {

  user: any = []
  identity_user: any

  constructor() { }

  ngOnInit() {
    this.identity_user = JSON.parse(localStorage.getItem('identity_user'))
  }

}
