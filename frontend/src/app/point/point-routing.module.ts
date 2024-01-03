import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPointPageComponent } from './layout/layout-point-page/layout-point-page.component';


const routes: Routes = [
  {
    path: 'point', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule), component: LayoutPointPageComponent,
  },
  {
    path: 'user', loadChildren: () => import('./users/users.module').then(m => m.UsersModule), component: LayoutPointPageComponent,
  },
  {
    path: "**", redirectTo: 'point', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointRoutingModule { }
