import { Component, OnInit } from '@angular/core';
import { UserServices } from '../../services/user.service';
import { Users } from '../../interfaces/users';

@Component({
  selector: 'app-home-users-page',
  templateUrl: './home-users-page.component.html',
  styleUrls: ['./home-users-page.component.css']
})
export class HomeUsersPageComponent implements OnInit {

  constructor(private userService: UserServices) { }

  ngOnInit() {
  }



}
