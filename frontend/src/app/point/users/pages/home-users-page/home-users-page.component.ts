import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { VentasService } from 'src/app/point/ventas/services/ventas.service';

@Component({
  selector: 'app-home-users-page',
  templateUrl: './home-users-page.component.html',
  styleUrls: ['./home-users-page.component.css']
})
export class HomeUsersPageComponent implements OnInit {

  identityUser = JSON.parse(localStorage.getItem('identity_user'))
  total_ventas: number

  constructor(
    private authService: AuthService,
    private ventasService: VentasService
  ) { }

  ngOnInit() {
    this.authService.checkSignIn(this.identityUser)
    this.ventas()
  }

  getHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
  }

  ventas() {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.ventasService.getTotalVentas(options)
      .subscribe((total) => {
        this.total_ventas = total ? total : 0
      })
  }

  t: number = 15

  html: any = `
  <div class="row card bg-primary p-0 mx-1 my-3" [routerLink]="['/user/ventas']">
    <div class="card-header">Ventas</div>
    <div class="card-body">
      <h5>
        Tus ventas hoy ${this.t}
      </h5>
    </div>
  </div>
  `

  card() {
    return
    `
      <div class="card-header">Ventas</div>
        <div class="card-body">
          <h5>
            Tus ventas hoy {{ total_ventas | currency }}
          </h5>
      </div>
      `

  }

}
