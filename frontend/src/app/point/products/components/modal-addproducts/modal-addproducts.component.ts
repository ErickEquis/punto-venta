import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-addproducts',
  templateUrl: './modal-addproducts.component.html',
  styleUrls: ['./modal-addproducts.component.css']
})
export class ModalAddproductsComponent implements OnInit {

  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))
  formAdd: any;
  camara: boolean = false

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.formAdd = new FormGroup({
      descripcion: new FormControl(''),
      precio: new FormControl(''),
      cantidad: new FormControl(''),
      codigo: new FormControl(''),
    })
  }

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

  addProducto() {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.formAdd.value.descripcion = this.formAdd.value.descripcion.toLowerCase()
    this.productoService.createProducto(this.formAdd.value, options)
      .subscribe(
        (response) => {
          this.toastr.success('', response.mensaje);
          this.reloadInventario()
          this.formAdd.reset()
        },
        (error) => {
          if (error.status == 403) {
            setTimeout(() => {
              this.authService.signOut()
            }, 1500);
          }
          this.toastr.error('', error.error.mensaje);
          this.formAdd.reset()
        }
      )
  }

  camaraEstatus() {
    this.camara = !this.camara
  }

  scan($event: any) {
    this.camara = false
    $event ? this.formAdd.patchValue({codigo: $event}) : ''
  }

  cleanForm() {
    this.formAdd.reset()
  }

  get descripcion() {
    return this.formAdd.get('descripcion').value
  }

  get precio() {
    return this.formAdd.get('precio').value
  }

  get cantidad() {
    return this.formAdd.get('cantidad').value
  }

}
