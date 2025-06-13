import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPointPageComponent } from './layout/layout-point-page/layout-point-page.component';


const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), component: LayoutPointPageComponent,
    }],
  },
  {
    path: '',
    children: [{
      path: 'product', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule), component: LayoutPointPageComponent,
    }],
  },
  {
    path: '',
    children: [{
      path: 'user', loadChildren: () => import('./users/users.module').then(m => m.UsersModule), component: LayoutPointPageComponent,
    }]
  },
  {
    path: '',
    children: [{
      path: "**", redirectTo: 'dashboard/home', pathMatch: 'full'
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointRoutingModule { }
