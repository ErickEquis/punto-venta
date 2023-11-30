import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto-service.service';
import { Productos } from '../../interfaces/productos';

@Component({
  selector: 'app-inventario-page',
  templateUrl: './inventario-page.component.html',
  styleUrls: ['./inventario-page.component.css']
})
export class InventarioPageComponent implements OnInit {

  listProductos: Productos[]
  existe: boolean
  edit: boolean = false

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.getProdutos()
  }

  getProdutos() {
    this.productoService.getProdutos()
      .subscribe((data: Productos[]) => {
        this.listProductos = data
      })
  }

  deleteProducto(id: number) {
    this.productoService.deleteProducto(id).subscribe()
  }
  
  eliminar(id: number) {
    this.deleteProducto(id)
    this.getProdutos()
  }

  editState(producto): void {
    this.edit = !this.edit
    console.log(this.edit)
    console.log(producto)
  }

}
