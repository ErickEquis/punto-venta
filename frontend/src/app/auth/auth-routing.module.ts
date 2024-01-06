import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { LayoutAuthPageComponent } from './pages/layout-auth-page/layout-auth-page.component';
import { RestorePwdPageComponent } from './pages/restore-pwd-page/restore-pwd-page.component';
import { ForgotPwdPageComponent } from './pages/forgot-pwd-page/forgot-pwd-page.component';


const routes: Routes = [
  {
    path: '', component: LayoutAuthPageComponent,
    children: [
      {
        path: "log-in", component: LoginPageComponent
      },
      {
        path: "sign-up", component: SignupPageComponent
      },
      {
        path: 'restore-password', component: RestorePwdPageComponent
      },
      {
        path: 'forgot-password', component: ForgotPwdPageComponent
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
