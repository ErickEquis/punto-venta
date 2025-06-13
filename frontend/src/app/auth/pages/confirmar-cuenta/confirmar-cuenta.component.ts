import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirmar-cuenta',
  template: `
    <div class="text-center p-4">
      <h3 class="mb-2 fw-semibold">Confirmación de cuenta</h3>
      <p class="opacity-75">¡Bienvenido!</p>
    </div>
  `,
  styleUrls: ['./confirmar-cuenta.component.css']
})
export class ConfirmarCuentaComponent implements OnInit {

  token: any
  options: any = {}

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    // localStorage.removeItem("identity_user")
    this.token = this.router.parseUrl(this.router.url).queryParamMap['params']['token'];
    this.token ? this.confirmarCuenta() : window.location.assign('/auth/log-in');
  }

  confirmarCuenta() {
    this.options.params = new HttpParams()
      .set('token', this.token)
    this.authService.confirmarCuenta(this.options)
      .subscribe({
        next: response => {
          this.toastr.success('', response.mensaje);
          this.router.navigate(["/auth/log-in"])
        },
        error: error => {
          this.toastr.error('', error.error.mensaje);
          this.router.navigate(["/auth/log-in"])
        }
      })
  }

}
