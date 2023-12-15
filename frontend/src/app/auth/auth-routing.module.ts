import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';


const routes: Routes = [
  {
    path: "", component: LayoutPageComponent,
    children: [
      {
        path: "log-in", component: LoginPageComponent
      },
      {
        path: "sign-up", component: SignupPageComponent
      },
      {
        path: "**", redirectTo: 'log-in', pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
