import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { VentasService } from 'src/app/point/ventas/services/ventas.service';

@Component({
  selector: 'app-ventas-page',
  templateUrl: './ventas-page.component.html',
  styleUrls: ['./ventas-page.component.css']
})
export class VentasPageComponent implements OnInit {

  identityUser = JSON.parse(localStorage.getItem('identity_user'))
  listVentas: any
  editVenta: any
  options: any = {}

  constructor(private ventasService: VentasService) { }

  ngOnInit() {
    this.getVentas()
  }

  getHeaders(token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
    return headers
  }

  getVentas() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.ventasService.getVentas(this.options)
      .subscribe(
        (data) => {this.listVentas = data}
      )
  }

  getVenta(id: number) {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.ventasService.getVentaId(id, this.options)
      .subscribe((venta) => {
        this.editVenta = venta
      })
  }

}
