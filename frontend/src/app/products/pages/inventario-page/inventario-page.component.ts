import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Productos } from '../../interfaces/productos';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-inventario-page',
  templateUrl: './inventario-page.component.html',
  styleUrls: ['./inventario-page.component.css']
})
export class InventarioPageComponent implements OnInit {

  listProductos: Productos[] = []
  existe: boolean
  addProductoFlag: boolean = false
  editProductoFlag: boolean = false
  productoBuscado: string = ''
  productoEditId: number
  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))

  formEdit: any
  formAdd: any

  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getProdutos()

    this.formEdit = new FormGroup({
      descripcion: new FormControl(''),
      precio: new FormControl(''),
      cantidad: new FormControl(''),
    })

    this.formAdd = new FormGroup({
      descripcion: new FormControl(''),
      precio: new FormControl(''),
      cantidad: new FormControl(''),
    })
  }

  getHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
  }

  getProdutos(descripcion?: string) {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.productoService.getProdutos(descripcion, options)
      .subscribe((data: Productos[]) => {
        this.listProductos = data
      },
        (error) => {
          if (error.status == 403) {
            setTimeout(() => {
              this.authService.signOut()
            }, 1500);
          }
          this.toastr.error(error.error.mensaje, 'Error!');
        }
      )
  }

  filtrarProductos() {
    this.getProdutos(this.productoBuscado)
  }

  deleteProducto(id: number) {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.productoService.deleteProducto(id, options).subscribe(
      () => this.getProdutos(),
      (error) => {
        if (error.status == 403) {
          setTimeout(() => {
            this.authService.signOut()
          }, 1500);
        }
        this.toastr.error(error.error.mensaje, 'Error!');
      }
    )
  }

  eliminar(id: number) {
    this.deleteProducto(id)
  }

  editState(producto: any): void {
    this.listProductos.forEach((producto) => producto.estatus = true)
    producto.estatus = !producto.estatus
    this.editProductoFlag = !this.editProductoFlag
    this.formEdit.setValue({descripcion: producto.descripcion, precio: producto.precio, cantidad: producto.cantidad})
    this.productoEditId = producto.id
  }

  editProducto() {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.productoService.editProducto(this.productoEditId, this.formEdit.value, options).subscribe(
      () => this.getProdutos(),
      (error) => {
        if (error.status == 403) {
          setTimeout(() => {
            this.authService.signOut()
          }, 1500);
        }
        this.toastr.error(error.error.mensaje, 'Error!');
      }
    )
    this.change()
  }

  addProducto() {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.productoService.createProducto(this.formAdd.value, options).subscribe(
      () => this.getProdutos(),
      (error) => {
        if (error.status == 403) {
          setTimeout(() => {
            this.authService.signOut()
          }, 1500);
        }
        this.toastr.error(error.error.mensaje, 'Error!');
      }
    )
    this.addProductoFlag = !this.addProductoFlag
  }

  change() {
    let producto = this.listProductos.find((producto) => producto.id === this.productoEditId)
    producto.estatus = !producto.estatus
    this.editProductoFlag = !this.editProductoFlag
  }

}
