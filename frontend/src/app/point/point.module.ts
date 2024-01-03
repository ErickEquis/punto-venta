import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointRoutingModule } from './point-routing.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { UsersRoutingModule } from './users/users-routing.module';
import { ProductsRoutingModule } from './products/products-routing.module';
import { LayoutPointPageComponent } from './layout/layout-point-page/layout-point-page.component';


@NgModule({
  declarations: [LayoutPointPageComponent],
  imports: [
    CommonModule,
    PointRoutingModule,
    ProductsModule,
    ProductsRoutingModule,
    UsersModule,
    UsersRoutingModule,
  ]
})
export class PointModule { }
