import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProductsRoutingModule } from './products-routing.module';
import { InventarioPageComponent } from './pages/inventario-page/inventario-page.component';
import { CardComponentComponent } from './components/card-component/card-component.component';
import { NavbarComponentComponent } from './components/navbar-component/navbar-component.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomePageComponent, LayoutPageComponent, InventarioPageComponent, CardComponentComponent, NavbarComponentComponent],
  exports: [],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule
  ]
})
export class ProductsModule { }
