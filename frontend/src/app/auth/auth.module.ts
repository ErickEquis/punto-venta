import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutAuthPageComponent } from './pages/layout-auth-page/layout-auth-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { RestorePwdPageComponent } from './pages/restore-pwd-page/restore-pwd-page.component';
import { ForgotPwdPageComponent } from './pages/forgot-pwd-page/forgot-pwd-page.component';
import { NewMemberComponent } from './pages/new-member/new-member.component';



@NgModule({
  declarations: [
    LoginPageComponent,
    SignupPageComponent,
    LayoutAuthPageComponent,
    CarouselComponent,
    RestorePwdPageComponent,
    ForgotPwdPageComponent,
    NewMemberComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
