import { Component, OnInit } from '@angular/core';
import { Productos } from '../../interfaces/productos';
import { ProductoService } from '../../services/producto.service';
import { ProductosVenta } from '../../interfaces/productosVenta';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  listProductos: Productos[] = []

  ventaProductos: ProductosVenta[] = [
    // {
    //   id: 1,
    //   descripcion: "descripcion",
    //   precio: 1,
    //   cantidad: 1
    // },
  ]

  productoBuscado: string = ''

  itemById: Productos[]

  item: any = {}

  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() { }

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
      this.productoService.getProdutos(this.productoBuscado).subscribe((data: Productos[]) => {
        this.listProductos = data
      },
        (error) => {
          this.toastr.error(error.error.mensaje, 'Error!');
        }
      )
    }
    this.listProductos = []
  }

  getProductoId(item: any): void {
    this.productoService.getProductoId(item.id)
      .subscribe((dato: any) => {
        this.itemById = dato
      },
        (error) => {
          this.toastr.error(error.error.mensaje, 'Error!');
        }
      )
  }

  selectProducto(item: any) {
    this.productoBuscado = item.descripcion
    this.getProductoId(item)
  }

}
