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

  constructor(private ventasService: VentasService) { }

  ngOnInit() {
    this.getVentas()
  }

  getHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
  }

  getVentas() {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.ventasService.getVentas(options)
      .subscribe(
        (data) => {this.listVentas = data}
      )
  }

  getVenta(id: number) {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.ventasService.getVentaId(id, options)
      .subscribe((venta) => {
        this.editVenta = venta
      })
  }

}
