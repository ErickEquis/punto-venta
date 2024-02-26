import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeUsersPageComponent } from './pages/home-users-page/home-users-page.component';
import { EquipoPageComponent } from './pages/equipo-page/equipo-page.component';
import { VentasPageComponent } from '../ventas/pages/ventas-page/ventas-page.component';
import { ModalEditVentaComponent } from '../ventas/components/modal-edit-venta/modal-edit-venta.component';
import { ModalAddMemberComponent } from './components/modal-add-member/modal-add-member.component';
import { ModalNoficacionComponent } from './components/modal-noficacion/modal-noficacion.component';
import { NotificacionesPageComponent } from '../notificaciones/pages/notificaciones-page/notificaciones-page.component';
import { ModalNotificacionComponent } from '../notificaciones/components/modal-notificacion/modal-notificacion.component';

@NgModule({
  declarations: [HomeUsersPageComponent, EquipoPageComponent, VentasPageComponent, ModalEditVentaComponent, ModalAddMemberComponent, ModalNoficacionComponent, NotificacionesPageComponent, ModalNotificacionComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UsersModule { }
