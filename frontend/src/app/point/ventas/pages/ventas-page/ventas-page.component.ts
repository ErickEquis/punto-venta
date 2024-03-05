import { HttpHeaders } from '@angular/common/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { VentasService } from 'src/app/point/ventas/services/ventas.service';

@Component({
  selector: 'app-ventas-page',
  templateUrl: './ventas-page.component.html',
  styleUrls: ['./ventas-page.component.css']
})
export class VentasPageComponent implements OnInit, DoCheck {

  identityUser = JSON.parse(localStorage.getItem('identity_user'))
  listVentas: any
  editVenta: any
  options: any = {}
  refresh: boolean = false

  constructor(
    private ventasService: VentasService,
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
    this.getVentas();
    document.querySelectorAll('.show').forEach((l) => l.classList.remove('modal-backdrop', 'fade', 'show'));
  }

  ngDoCheck(): void {
    if (this.refresh) {
      this.getVentas()
      this.refresh = false
    }
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
        (data) => { this.listVentas = data }
      )
  }

  getVenta(id: number) {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.ventasService.getVentaId(id, this.options)
      .subscribe((venta) => {
        this.editVenta = venta
      })
  }

  deleteVenta(id: number) {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    console.log(id)
    this.ventasService.deleteVenta(id, this.options).subscribe(
      (response) => {
        this.getVentas()
        this.toastr.success(response.mensaje, 'Éxito!');
      },
      (error) => {
        this.toastr.error(error.error.mensaje, 'Error!');
      }
    )
  }

  reload() {
    this.refresh = true
  }

}
