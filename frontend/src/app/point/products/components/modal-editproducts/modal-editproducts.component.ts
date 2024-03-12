import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { throwError } from 'rxjs';
import { Productos } from '../../interfaces/productos';

@Component({
  selector: 'app-modal-editproducts',
  templateUrl: './modal-editproducts.component.html',
  styleUrls: ['./modal-editproducts.component.css']
})
export class ModalEditproductsComponent implements OnInit, OnChanges {

  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))

  formEdit: any;
  listProductos: Productos[] = []
  productoEditId: number

  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.formEdit = new FormGroup({
      descripcion: new FormControl(''),
      precio: new FormControl(''),
      cantidad: new FormControl(''),
      codigo: new FormControl(''),
    })
  }

  ngOnChanges() {
    this.producto ? this.setEditValues(this.producto) : '';
  }

  @Input() producto?: any
  @Output() reloadGetEvent = new EventEmitter<any>();

  reloadInventario() {
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

  get descripcion() {
    return this.formEdit.get('descripcion').value
  }

  get precio() {
    return this.formEdit.get('precio').value
  }

  get cantidad() {
    return this.formEdit.get('cantidad').value
  }

  editProducto() {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.productoService.editProducto(this.productoEditId, this.formEdit.value, options)
      .subscribe(
        (response) => {
          this.toastr.success('', response.mensaje);
          this.reloadInventario()
        },
        (error) => {
          if (error.status == 403) {
            setTimeout(() => {
              this.authService.signOut()
            }, 1500);
          }
          this.toastr.error('', error.error.mensaje);
        }
      )
  }

  setEditValues(producto?: any): void {
    this.formEdit.setValue(
      {
        descripcion: (producto.descripcion.charAt(0).toUpperCase() + producto.descripcion.slice(1)),
        precio: producto.precio,
        cantidad: producto.cantidad,
        codigo: producto.codigo
      }
    )
    this.productoEditId = producto.id
  }

  clean() {
    this.reloadInventario()
  }

}
