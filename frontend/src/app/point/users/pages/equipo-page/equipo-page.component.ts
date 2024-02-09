import { Component, OnInit } from '@angular/core';

import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Users } from '../../interfaces/users';
import { UserServices } from '../../services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-equipo-page',
  templateUrl: './equipo-page.component.html',
  styleUrls: ['./equipo-page.component.css']
})
export class EquipoPageComponent implements OnInit {

  listUsers: Users[] = []
  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))
  options: any = {}
  isAdmin: boolean

  constructor(
    private userService: UserServices,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  getHeaders(token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
    return headers
  }

  ngOnInit() {
    this.authService.checkSignIn(this.identityUser);
    (this.identityUser.rol == 10) ? (this.isAdmin = true) : (this.isAdmin = false);
    this.getUsers();
  }

  getUsers() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.userService.getUsers(this.options)
      .subscribe((data: Users[]) => {
        this.listUsers = data
      },
        (error) => {
          if (error.status == 403) {
            setTimeout(() => {
              this.authService.signOut()
            }, 1500);
          }
          this.toastr.error(error.error.mensaje, 'Error!');
        }
      )
  }

  deleteUser(id: number) {
    this.options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.userService.deleteUser(id, this.options)
      .subscribe(
        (response) => {
          this.toastr.success(response.mensaje, '')
          this.getUsers()
        },
        (error) => {
          if (error.status == 403) {
            setTimeout(() => {
              this.authService.signOut()
            }, 1500);
          }
          this.toastr.error(error.error.mensaje, 'Error!');
        }
      )
  }

}
