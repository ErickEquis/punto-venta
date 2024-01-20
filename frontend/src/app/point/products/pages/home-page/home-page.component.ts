import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { Productos } from '../../interfaces/productos';
import { ProductosVenta } from '../../interfaces/productosVenta';
import { ProductoService } from '../../services/producto.service';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges, DoCheck {

  listProductos: Productos[] = []
  ventaProductos: ProductosVenta[] = [
    {
      id: 1,
      descripcion: "descripcion1",
      precio: 1,
      cantidad: 1
    },
    // {
    //   id: 2,
    //   descripcion: "descripcion2",
    //   precio: 1,
    //   cantidad: 3
    // },
    // {
    //   id: 3,
    //   descripcion: "descripcion3",
    //   precio: 1,
    //   cantidad: 4
    // },
  ]
  productoBuscado: string = ''
  itemById: Productos[]
  item: any = {}
  producto: any
  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))
  modal: string = ''
  total: number = 0
  bodyVenta: any = {}
  isDisabled: boolean

  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService,
    private authService: AuthService,
    private ventaService: VentaService,
  ) { }

  ngOnInit() {
    this.authService.checkSignIn(this.identityUser);
    (window.innerWidth < 576) ? this.modal = 'modal' : this.modal = ''
  }

  ngOnChanges(): void {
  }

  ngDoCheck(): void {
    this.getTotal();
    (this.total == 0) ? this.isDisabled = true : this.isDisabled = null
  }

  getHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
  }

  cantidadVenta(n: number, producto: any) {
    let p = this.ventaProductos.find(p => p.descripcion == producto.descripcion)
    let i = this.ventaProductos.indexOf(p)
    this.ventaProductos[i].cantidad += n
    if (this.ventaProductos[i].cantidad == 0) {
      this.eliminar(p)
    }
  }

  eliminar(producto: any) {
    let p = this.ventaProductos.find(p => p.descripcion == producto.descripcion)
    let i = this.ventaProductos.indexOf(p)
    this.ventaProductos.splice(i, 1)
  }

  agregarProducto() {
    this.item = {
      id: this.itemById['id'],
      descripcion: this.itemById['descripcion'],
      precio: this.itemById['precio'],
      cantidad: 1
    }
    let p = this.ventaProductos.find(data => (data.descripcion === this.itemById['descripcion'])
    )
    p ? this.cantidadVenta(1, p) : this.ventaProductos.push(this.item)
    this.productoBuscado = ''
    this.itemById = []
  }

  getProductos() {
    if (this.productoBuscado != '') {
      let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
      this.productoService.getProdutos(this.productoBuscado, options).subscribe((data: Productos[]) => {
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
    this.listProductos = []
  }

  getProductoId(item: any): void {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.productoService.getProductoId(item.id, options)
      .subscribe((dato: any) => {
        this.itemById = dato
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

  selectProducto(item: any) {
    this.productoBuscado = item.descripcion
    this.getProductoId(item)
  }

  editProducto(producto: any) {
    this.producto = producto
  }

  getTotal() {
    this.total = 0
    this.ventaProductos.forEach((producto) => {
      this.total += (producto.precio * producto.cantidad)
    })
  }

  venta() {
    this.bodyVenta.productos = this.ventaProductos
    this.bodyVenta.total_venta = this.total

    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.ventaService.venta(this.bodyVenta, options).subscribe(
      (response) => this.toastr.success(response.mensaje, 'Éxito!'),
      (error) => this.toastr.error(error.error.mensaje, 'Error!')
    )

    this.ventaProductos = []
  }

}
