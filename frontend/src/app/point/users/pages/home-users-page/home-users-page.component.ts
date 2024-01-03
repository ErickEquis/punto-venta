import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home-users-page',
  templateUrl: './home-users-page.component.html',
  styleUrls: ['./home-users-page.component.css']
})
export class HomeUsersPageComponent implements OnInit {

  user: any = []
  identity_user = JSON.parse(localStorage.getItem('identity_user'))

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkSignIn(this.identity_user)
  }

}
