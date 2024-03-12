import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirmar-cuenta',
  templateUrl: './confirmar-cuenta.component.html',
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
    localStorage.removeItem("identity_user")
    this.token = this.router.parseUrl(this.router.url).queryParamMap['params']['token'];
    this.token ? this.confirmarCuenta() : window.location.assign('/auth/log-in');
  }

  confirmarCuenta() {
    this.options.params = new HttpParams()
      .set('token', this.token)
    this.authService.confirmarCuenta(this.options)
      .subscribe(
        response => {
          this.toastr.success('', response.mensaje);
          this.router.navigate(["/auth/log-in"])
        },
        error => {
          this.toastr.error('', error.error.mensaje);
          this.router.navigate(["/auth/log-in"])
        }
      )
  }

}
