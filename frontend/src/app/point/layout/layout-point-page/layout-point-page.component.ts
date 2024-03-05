import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-layout-point-page',
  templateUrl: './layout-point-page.component.html',
  styleUrls: ['./layout-point-page.component.css']
})
export class LayoutPointPageComponent implements OnInit {

  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))

  constructor(
    private authService: AuthService
  ) {
    this.identityUser ? null : this.authService.signOut();
  }

  ngOnInit() {
  }

}
