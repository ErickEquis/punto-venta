import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Productos } from '../../interfaces/productos';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { VentasService } from 'src/app/point/ventas/services/ventas.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css',
  host: { class: 'h-100 col-9' }
})
export class VentasComponent {

    identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))
    listProductos: Productos[] = []
    ventaProductos: any[] = []
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

    @Input() clienteIndex: number;
    @Output() eliminarCuenta = new EventEmitter<any>();
    @Output() totalVenta = new EventEmitter<any>();

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

    ngDoCheck(): void {
      (!this.itemById) ? this.isDisabledAgregar = true : this.isDisabledAgregar = null;
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
      // this.edit(this.ventaProductos[i])
      if (this.ventaProductos[i].cantidad == 0) {
        this.eliminar(p)
      }
    }

    edit(item: any) {
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

    eliminar(producto: any) {
      let p = this.ventaProductos.find(p => p.descripcion == producto.descripcion);
      let i = this.ventaProductos.indexOf(p);
      this.ventaProductos.splice(i, 1);
      this.getTotal();
    }

    agregarProducto() {
      this.item = {
        id: this.itemById['id'],
        descripcion: this.itemById['descripcion'],
        precio: this.itemById['precio'],
        cantidad: 1,
        stock: this.itemById['cantidad'],
      }
      let p = this.ventaProductos.find(data => (data.descripcion === this.itemById['descripcion']));
      p ? this.cantidadVenta(1, p) : this.ventaProductos.push(this.item);
      this.productoBuscado = '';
      this.itemById = null;
      this.listProductos = [];
      this.getTotal();
    }

    getProductos() {
      if (this.productoBuscado != '') {
        this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
        this.options.params = new HttpParams()
          .set('venta', 'true')
          .set('descripcion', this.productoBuscado)
        this.productoService.getProdutos(this.options)
          .subscribe({
            next: (data: Productos[]) => {
              if (/^\d{8,14}$/.test(this.productoBuscado)) {
                if(data.length > 0) {
                  this.selectProducto(data[0])
                } else {
                  this.toastr.error('', 'No se encontró el producto');
                }
              } else {
              this.listProductos = data
              }
            },
            error: (error) => {
              if (error.status == 403) {
                setTimeout(() => {
                  this.authService.signOut()
                }, 1500);
              }
              this.toastr.error('', error.error.mensaje);
            }
          })
      }
      this.listProductos = []
    }

    getProductoId(item: any): void {
      this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
      this.productoService.getProductoId(item.id, this.options)
        .subscribe({
          next: (dato: any) => {
            this.itemById = dato
            this.agregarProducto()
          },
          error: (error) => {
            if (error.status == 403) {
              setTimeout(() => {
                this.authService.signOut()
              }, 1500);
            }
            this.toastr.error('', error.error.mensaje);
          }
        })
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
      this.totalVenta.emit({ totalVenta: this.total, clienteIndex: this.clienteIndex });
    }

    venta() {
      this.bodyVenta.productos = this.ventaProductos
      this.bodyVenta.total_venta = this.total

      this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
      this.ventasService.createVenta(this.bodyVenta, this.options)
        .subscribe({
          next: (response) => {
            this.toastr.success('', response.mensaje);
            this.eliminarCuenta.emit(this.clienteIndex);
          },
          error: (error) => this.toastr.error('', error.error.mensaje)
        })

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
          .subscribe({
            next: (producto) => {
              this.itemById = producto
              this.agregarProducto()
            },
            error: (error) => this.toastr.error('', error.error.mensaje)
          })
      }
    }

    borrarCuenta() {
      this.ventaProductos = [];
      this.getTotal();
    }

    actualizarCantidad(index) {
      if (this.ventaProductos[index].cantidad >= this.ventaProductos[index].stock) {
        this.ventaProductos[index].cantidad = this.ventaProductos[index].stock
      }
      this.getTotal();
    }

    isBarCode(value: string) {
      console.log({value})
    }

}
