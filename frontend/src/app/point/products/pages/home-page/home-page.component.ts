import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Productos } from '../../interfaces/productos';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { VentasService } from 'src/app/point/ventas/services/ventas.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges, DoCheck {

  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))
  listProductos: Productos[] = []
  ventaProductos: any[] = [
    // {
    //   id: 1,
    //   descripcion: 'string',
    //   precio: 1,
    //   cantidad: 1,
    //   estatus: true
    // }
  ]
  productoBuscado: string = ''
  itemById: Productos[]
  item: any = {}
  producto: any
  modal: string = ''
  total: number = 0
  bodyVenta: any = {}
  isDisabledVender: boolean
  isDisabledAgregar: boolean
  camara: boolean = false
  options: any = {}
  isDisabledAdd: boolean

  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService,
    private authService: AuthService,
    private ventasService: VentasService,
  ) { }

  ngOnInit() {
    this.authService.checkSignIn(this.identityUser);
    (window.innerWidth < 576) ? this.modal = 'modal' : this.modal = '';
    document.querySelectorAll('.show').forEach((l) => l.classList.remove('modal-backdrop', 'fade', 'show'));
  }

  ngOnChanges(): void {
  }

  ngDoCheck(): void {
    (!this.itemById) ? this.isDisabledAgregar = true : this.isDisabledAgregar = null
    this.getTotal();
    (this.total == 0) ? this.isDisabledVender = true : this.isDisabledVender = null
  }

  getHeaders(token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
    return headers
  }

  cantidadVenta(n: number, producto: any) {
    let p = this.ventaProductos.find(p => p.descripcion == producto.descripcion)
    let i = this.ventaProductos.indexOf(p);
    this.ventaProductos[i].cantidad += n;
    (this.ventaProductos[i].cantidad == this.ventaProductos[i].stock) ? this.isDisabledAdd = true : this.isDisabledAdd = null
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
      cantidad: 1,
      stock: this.itemById['cantidad'],
    }
    let p = this.ventaProductos.find(data => (data.descripcion === this.itemById['descripcion']))
    p ? this.cantidadVenta(1, p) : this.ventaProductos.push(this.item);
    this.productoBuscado = ''
    this.itemById = null
    this.listProductos = []
  }

  getProductos() {
    if (this.productoBuscado != '') {
      this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
      this.options.params = new HttpParams()
        .set('venta', 'true')
        .set('descripcion', this.productoBuscado)
      this.productoService.getProdutos(this.options)
        .subscribe((data: Productos[]) => {
          this.listProductos = data
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
    this.listProductos = []
  }

  getProductoId(item: any): void {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.productoService.getProductoId(item.id, this.options)
      .subscribe((dato: any) => {
        this.itemById = dato
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

    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.ventasService.createVenta(this.bodyVenta, this.options).subscribe(
      (response) => this.toastr.success('', response.mensaje),
      (error) => this.toastr.error('', error.error.mensaje)
    )

    this.ventaProductos = []
  }

  camaraEstatus() {
    this.camara = true
  }

  scan($event?: any) {
    this.camara = false
    if ($event) {
      this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
      this.productoService.getProductoCode($event, this.options)
        .subscribe(
          (producto) => {
            this.itemById = producto
            this.agregarProducto()
          },
          (error) => this.toastr.error('', error.error.mensaje)
        )
    }
  }

}
