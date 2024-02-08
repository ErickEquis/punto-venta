import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'layout-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  identityUser = JSON.parse(localStorage.getItem('identity_user'))

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.signOut()
  }

}
