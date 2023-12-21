import { Component, OnInit } from '@angular/core';
import { Users } from '../../interfaces/users';
import { UserServices } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-equipo-page',
  templateUrl: './equipo-page.component.html',
  styleUrls: ['./equipo-page.component.css']
})
export class EquipoPageComponent implements OnInit {

  listUsers: Users[] = []

  constructor(
    private userService: UserServices,
    private toastr: ToastrService
    ) { }

  ngOnInit() {
    this.getUsers()
  }

  getUsers() {
    this.userService.getUsers().subscribe((data: Users[]) => {
      this.listUsers = data
    },
      (error) => {
        this.toastr.error(error.error.mensaje, 'Error!');
      }
    )
  }

}
