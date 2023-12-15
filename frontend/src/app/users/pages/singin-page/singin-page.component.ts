import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserServices } from '../../services/user.service';

@Component({
  selector: 'app-singin-page',
  templateUrl: './singin-page.component.html',
  styleUrls: ['./singin-page.component.css']
})
export class SinginPageComponent implements OnInit {

  formSingIn: any

  constructor(private userService: UserServices) { }

  ngOnInit() {
    this.formSingIn = new FormGroup({
      nombre: new FormControl(''),
      contrasenia: new FormControl(''),
    })
  }

  singIn() {
    console.log(this.formSingIn.value)
    this.userService.createSesion(this.formSingIn.value).subscribe()
  }

}
