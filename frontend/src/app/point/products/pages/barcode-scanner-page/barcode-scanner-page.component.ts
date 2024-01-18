import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-barcode-scanner-page',
  templateUrl: './barcode-scanner-page.component.html',
  styleUrls: ['./barcode-scanner-page.component.css']
})
export class BarcodeScannerPageComponent implements OnInit {

  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))
  formAdd: any




  producto: any
  toastr: any
  codeFront: any = ''
  pasa: any

  constructor(
    private productoService: ProductoService,
  ) { }

  ngOnInit() {
    this.formAdd = new FormGroup({
      descripcion: new FormControl(''),
      precio: new FormControl(''),
      cantidad: new FormControl(''),
      codigo: new FormControl(this.codeFront),
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

  getProducto(codigo: any): void {
    // this.codeFront = code
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.productoService.getProductoCode(codigo, options)
      .subscribe((dato: any) => {
        this.producto = dato
      }, (error) => {
        this.toastr.error('error.error.mensaje', 'Error!');
      }
      )
  }

  addProducto() {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.productoService.createProducto(this.formAdd.value, options)
      .subscribe()
  }

  scanSuccessHandler(codigo: any) {

    this.codeFront = codigo

    // if (code) {
    //   this.pasa = 'pasa'
    //   // this.getProducto(code)
    // }
  }
}
