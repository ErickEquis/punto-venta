import { Component, OnInit } from '@angular/core';
import { Productos } from '../../interfaces/productos';
import { ProductoService } from '../../services/producto-service.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  listProductos: Productos[]

  ventaProductos: Productos[] = [
    {
      id: 1,
      descripcion: "producto1",
      precio: 12.5,
      cantidad: 1,
      estatus: true
    },
    {
      id: 3,
      descripcion: "producto3",
      precio: 2.5,
      cantidad: 1,
      estatus: true
    },
    {
      id: 2,
      descripcion: "producto2",
      precio: 1.5,
      cantidad: 1,
      estatus: true
    },
  ]

  producto: string = ''

  constructor(private productoService: ProductoService) { }

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

  agregarProducto(id: number) {
    // this.getProductoId(id)
    let p = this.ventaProductos.find(p => p.descripcion == this.producto)

    let prueba = {
      id: 3,
      descripcion: this.producto,
      precio: 2.5,
      cantidad: 1,
      estatus: true
    }

    p ? this.cantidadVenta(1, p) : this.ventaProductos.push(prueba)
    this.producto = ''
  }

  getProductos() {
    this.productoService.getProdutos().subscribe((data: Productos[]) => {
      this.listProductos = data
    })
  }

  getProductoId(id: number) {
    this.productoService.getProductoId(id)
      .subscribe((p: Productos[]) => {
        console.log(p)
        // this.ventaProductos.push(p)
      })
  }

}
