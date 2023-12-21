import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Productos } from '../../interfaces/productos';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  formEdit: any
  formAdd: any

  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService
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

  getProdutos(descripcion?: string) {
    this.productoService.getProdutos(descripcion)
      .subscribe((data: Productos[]) => {
        this.listProductos = data
      },
        (error) => {
          this.toastr.error(error.error.mensaje, 'Error!');
        }
      )
  }

  filtrarProductos() {
    this.getProdutos(this.productoBuscado)
  }

  deleteProducto(id: number) {
    this.productoService.deleteProducto(id).subscribe(
      () => this.getProdutos(),
      (error) => {
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
    this.productoService.editProducto(this.productoEditId, this.formEdit.value).subscribe(
      () => this.getProdutos(),
      (error) => {
        this.toastr.error(error.error.mensaje, 'Error!');
      }
    )
    this.change()
  }

  addProducto() {
    this.productoService.createProducto(this.formAdd.value).subscribe(
      () => this.getProdutos(),
      (error) => {
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
