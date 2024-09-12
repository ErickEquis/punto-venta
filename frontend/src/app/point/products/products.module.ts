import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductsRoutingModule } from './products-routing.module';
import { InventarioPageComponent } from './pages/inventario-page/inventario-page.component';

import { ModalEditproductsComponent } from './components/modal-editproducts/modal-editproducts.component';
import { ModalAddproductsComponent } from './components/modal-addproducts/modal-addproducts.component';
import { ModalEditproductoVentaComponent } from './components/modal-editproducto-venta/modal-editproducto-venta.component';
import { ModalScanBarcodeComponent } from './components/modal-scan-barcode/modal-scan-barcode.component';

@NgModule({
  declarations: [HomePageComponent, InventarioPageComponent, ModalEditproductsComponent, ModalAddproductsComponent, ModalEditproductoVentaComponent, ModalScanBarcodeComponent],
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
