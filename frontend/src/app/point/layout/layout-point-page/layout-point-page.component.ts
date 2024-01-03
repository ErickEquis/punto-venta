import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-layout-point-page',
  templateUrl: './layout-point-page.component.html',
  styleUrls: ['./layout-point-page.component.css']
})
export class LayoutPointPageComponent implements OnInit {

  class: string = ""

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.signOut()
  }

}
