import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'point', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'user', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**', redirectTo: 'point', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }