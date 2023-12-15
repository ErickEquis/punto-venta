import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SingupPageComponent } from './pages/singup-page/singup-page.component';
import { SinginPageComponent } from './pages/singin-page/singin-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { HomeUsersPageComponent } from './pages/home-users-page/home-users-page.component';
import { LayoutUsersPageComponent } from './pages/layout-users-page/layout-users-page.component';
import { EquipoPageComponent } from './pages/equipo-page/equipo-page.component';


@NgModule({
  declarations: [SingupPageComponent, SinginPageComponent, MenuPageComponent, HomeUsersPageComponent, LayoutUsersPageComponent, EquipoPageComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UsersModule { }
