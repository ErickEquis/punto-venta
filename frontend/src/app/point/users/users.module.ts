import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { HomeUsersPageComponent } from './pages/home-users-page/home-users-page.component';
import { EquipoPageComponent } from './pages/equipo-page/equipo-page.component';

@NgModule({
  declarations: [MenuPageComponent, HomeUsersPageComponent, EquipoPageComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UsersModule { }
