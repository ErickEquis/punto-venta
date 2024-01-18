import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { InventarioPageComponent } from './pages/inventario-page/inventario-page.component';
import { BarcodeScannerPageComponent } from './pages/barcode-scanner-page/barcode-scanner-page.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home', component: HomePageComponent
      },
      {
        path: 'inventario', component: InventarioPageComponent
      },
      {
        path: 'scan', component: BarcodeScannerPageComponent
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
