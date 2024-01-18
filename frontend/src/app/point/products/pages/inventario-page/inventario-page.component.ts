import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Productos } from '../../interfaces/productos';
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
  productoBuscado: string = ''
  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))
  producto?: any

  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.checkSignIn(this.identityUser)
    this.getProdutos()
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

  setEditProducto(producto?: any): void {
    this.producto = producto
  }

  reloadGetEvent() {
    window.location.reload()
  }

}
