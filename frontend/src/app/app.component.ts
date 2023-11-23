import { Component } from '@angular/core';
import { ProductoServiceService } from './services/producto-service.service';
import { Producto } from './interfaces/producto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  producto: Producto [];

  constructor(private productoServie: ProductoServiceService) {}

  ngOnit(): void {
    // this.getProdutos()
  }

  getProdutos() {
    console.log('Esta entrando')
    this.productoServie.getProdutos().subscribe((data: Producto[]) => {
      this.producto = data
    })
  }
}
