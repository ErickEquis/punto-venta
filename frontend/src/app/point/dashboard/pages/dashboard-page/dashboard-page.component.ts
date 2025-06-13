import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { VentasService } from 'src/app/point/ventas/services/ventas.service';
import { ProductoService } from 'src/app/point/products/services/producto.service';
import { UserServices } from 'src/app/point/users/services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  identityUser = JSON.parse(localStorage.getItem('identity_user'));
  totalVentas: number = 0;
  totalProductos: number = 0;
  totalUsuarios: number = 0;
  ventas: any[] = [];
  options: any = {};

  constructor(
    private ventasService: VentasService,
    private productoService: ProductoService,
    private userService: UserServices,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.checkSignIn(this.identityUser);
    this.loadVentas();
    this.loadProductos();
    this.loadUsuarios();
  }

  getHeaders(token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return headers;
  }

  loadVentas() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError;
    this.ventasService.getVentas(this.options).subscribe({
      next: (data) => {
        this.ventas = data.slice(0, 5);
      }
    });
    this.ventasService.getTotalVentas({ headers: this.identityUser ? this.getHeaders(this.identityUser.token) : null }).subscribe({
      next: (total) => {
        this.totalVentas = total ? total : 0;
      }
    });
  }

  loadProductos() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError;
    this.productoService.getProdutos(this.options).subscribe({
      next: (data) => {
        this.totalProductos = data.length;
      }
    });
  }

  loadUsuarios() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError;
    this.userService.getUsers(this.options).subscribe({
      next: (data) => {
        this.totalUsuarios = data.length;
      }
    });
  }

}
