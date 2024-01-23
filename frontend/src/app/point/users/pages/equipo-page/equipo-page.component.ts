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

  constructor(
    private userService: UserServices,
    private toastr: ToastrService,
    private authService: AuthService,
    ) { }

  getHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
  }

  ngOnInit() {
    this.authService.checkSignIn(this.identityUser)
    this.getUsers()
  }

  getUsers() {
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.userService.getUsers(options)
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
    let options = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.userService.deleteUser(id, options)
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
