import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones.service';
import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notificaciones-page',
  templateUrl: './notificaciones-page.component.html',
  styleUrls: ['./notificaciones-page.component.css'],
})
export class NotificacionesPageComponent implements OnInit {

  identityUser = JSON.parse(localStorage.getItem('identity_user'))
  options: any = {}
  notificaciones: any
  data: any

  constructor(
    private notificacionesService: NotificacionesService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getNotificaciones();
    document.querySelectorAll('.show').forEach((l) => l.classList.remove('modal-backdrop', 'fade', 'show'));
  }

  getHeaders(token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
    return headers
  }

  getNotificaciones() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : null
    this.notificacionesService.getNotificaciones(this.options).subscribe((res) => {
      this.notificaciones = res
    })
  }

  setNotificacion(notificacion: any) {
    this.data = notificacion
  }

  delete(id: number) {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : null
    this.notificacionesService.deleteNotificacion(id, this.options).subscribe(
      (response) => {
        this.toastr.success(response.mensaje, 'Éxito!');
        this.getNotificaciones()
      },
      (error) => {
        this.toastr.error(error.error.mensaje, 'Error!');
      }
    )
  }

}
