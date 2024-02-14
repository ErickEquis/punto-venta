import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PointService } from 'src/app/point/services/point.service';

@Component({
  selector: 'layout-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  identityUser = JSON.parse(localStorage.getItem('identity_user'))
  options: any = {}
  count: number

  constructor(
    private authService: AuthService,
    private pointService: PointService,
    ) { }

  ngOnInit() {
    this.countNotificaciones()
  }

  getHeaders(token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
    return headers
  }

  logout() {
    this.authService.signOut()
  }

  countNotificaciones() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : null
    this.pointService.countNotificaciones(this.options).subscribe((count) => {
      this.count = count
    })
  }

}
