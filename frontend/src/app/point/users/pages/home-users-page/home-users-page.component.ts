import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PointService } from 'src/app/point/services/point.service';
import { VentasService } from 'src/app/point/ventas/services/ventas.service';

@Component({
  selector: 'app-home-users-page',
  templateUrl: './home-users-page.component.html',
  styleUrls: ['./home-users-page.component.css']
})
export class HomeUsersPageComponent implements OnInit {

  identityUser = JSON.parse(localStorage.getItem('identity_user'))
  total_ventas: number
  vendedor: any[]
  notificaciones: any[]
  options: any = {}
  notificacion: any

  constructor(
    private authService: AuthService,
    private ventasService: VentasService,
  ) { }

  ngOnInit() {
    this.authService.checkSignIn(this.identityUser);
    this.ventas();
    this.mayorVendedor();
    document.querySelectorAll('.show').forEach((l) => l.classList.remove('modal-backdrop', 'fade', 'show'));
  }

  getHeaders(token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
    return headers
  }

  ventas() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.ventasService.getTotalVentas(this.options)
      .subscribe((total) => {
        this.total_ventas = total ? total : 0
      })
  }

  mayorVendedor() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.options.params = new HttpParams().set('limit', '1')
    this.ventasService.mayorVendedores(this.options)
      .subscribe((res) => {
        this.vendedor = res[0]
      })
  }

}
