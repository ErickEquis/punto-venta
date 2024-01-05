import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductsRoutingModule } from './products-routing.module';
import { InventarioPageComponent } from './pages/inventario-page/inventario-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomePageComponent, InventarioPageComponent],
  exports: [],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ProductsModule { }
