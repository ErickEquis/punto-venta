import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { InventarioPageComponent } from './pages/inventario-page/inventario-page.component';


const routes: Routes = [
  {
    path: '', component: LayoutPageComponent,
    children: [
      {
        path: 'home', component: HomePageComponent
      },
      {
        path: 'inventario', component: InventarioPageComponent
      },
      {
        path: '**', redirectTo: 'home', pathMatch: 'full'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
