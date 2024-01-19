import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductsRoutingModule } from './products-routing.module';
import { InventarioPageComponent } from './pages/inventario-page/inventario-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarcodeScannerPageComponent } from './pages/barcode-scanner-page/barcode-scanner-page.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ModalEditproductsComponent } from './components/modal-editproducts/modal-editproducts.component';
import { ModalAddproductsComponent } from './components/modal-addproducts/modal-addproducts.component';
import { ModalEditproductoVentaComponent } from './components/modal-editproducto-venta/modal-editproducto-venta.component';

@NgModule({
  declarations: [HomePageComponent, InventarioPageComponent, BarcodeScannerPageComponent, ModalEditproductsComponent, ModalAddproductsComponent, ModalEditproductoVentaComponent],
  exports: [],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ZXingScannerModule,
  ]
})
export class ProductsModule { }
