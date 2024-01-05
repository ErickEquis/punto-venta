import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutAuthPageComponent } from './pages/layout-auth-page/layout-auth-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';



@NgModule({
  declarations: [LoginPageComponent, SignupPageComponent, LayoutAuthPageComponent, CarouselComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
