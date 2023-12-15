import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProductsRoutingModule } from './products-routing.module';
import { InventarioPageComponent } from './pages/inventario-page/inventario-page.component';
import { CardComponentComponent } from './components/card-component/card-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomePageComponent, LayoutPageComponent, InventarioPageComponent, CardComponentComponent],
  exports: [],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProductsModule { }
