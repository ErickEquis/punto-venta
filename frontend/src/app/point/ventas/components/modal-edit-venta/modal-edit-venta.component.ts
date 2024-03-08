import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { VentasService } from '../../services/ventas.service';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-edit-venta',
  templateUrl: './modal-edit-venta.component.html',
  styleUrls: ['./modal-edit-venta.component.css']
})
export class ModalEditVentaComponent implements OnInit, OnChanges, DoCheck {

  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))
  total: number
  formEditVenta: any

  constructor(
    private ventasService: VentasService,
    private toastr: ToastrService,
  ) {
    this.formEditVenta = new FormGroup({
      productos: new FormControl(''),
      total_venta: new FormControl(''),
    })
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
  }

  ngDoCheck(): void {
    this.venta ? this.getTotal() : '';
  }

  @Input() venta: any
  @Output() reloadGetEvent = new EventEmitter<any>();

  reloadVentas() {
    this.reloadGetEvent.emit();
  }

  getHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
  }

  getTotal() {
    this.total = 0
    this.venta.productos.forEach((producto: any) => {
      this.total += (producto.precio * producto.cantidad)
    })
  }

  edit(n: number, item: any) {
    (item.cantidad += n);
    if (item.cantidad <= 1) {
      document.getElementById(String(`${item.id}remove`)).setAttribute('disabled', 'true')
    } else {
      document.getElementById(String(`${item.id}remove`)).removeAttribute('disabled')
    }

    if (item.cantidad == item.stock) {
      document.getElementById(String(`${item.id}add`)).setAttribute('disabled', 'true')
    } else {
      document.getElementById(String(`${item.id}add`)).removeAttribute('disabled')
    }

  }

  hiddenData() {
    let tag = document.querySelectorAll('.show.collapse')
    tag.length ? tag.item(0).classList.remove('show') : null
  }

  delete(item: any) {
    this.venta.productos.splice(this.venta.productos.indexOf(item), 1)
  }

  editVenta() {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.formEditVenta.setValue({ productos: this.venta.productos, total_venta: this.total });
    this.ventasService.editVenta(this.formEditVenta.value, this.venta.id, options).subscribe(
      (response) => {
        this.reloadVentas()
        this.toastr.success(response.mensaje, 'Éxito!');
      },
      (error) => {
        this.toastr.error(error.error.mensaje, 'Error!');
      }
    )
  }

}
