import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserServices } from '../../services/user.service';


@Component({
  selector: 'app-singup-page',
  templateUrl: './singup-page.component.html',
  styleUrls: ['./singup-page.component.css']
})
export class SingupPageComponent implements OnInit {

  formSingUp: any

  constructor(private userService: UserServices) { }

  ngOnInit() {
    this.formSingUp = new FormGroup({
      nombre: new FormControl(''),
      correo: new FormControl(''),
      contrasenia: new FormControl(''),
      rol: new FormControl(''),
    })
  }

  createUser() {
    this.userService.createUser(this.formSingUp.value).subscribe()
  }

}
