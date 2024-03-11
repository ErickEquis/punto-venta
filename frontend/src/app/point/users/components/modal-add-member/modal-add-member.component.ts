import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-modal-add-member',
  templateUrl: './modal-add-member.component.html',
  styleUrls: ['./modal-add-member.component.css']
})
export class ModalAddMemberComponent implements OnInit {

  identityUser?: any = JSON.parse(localStorage.getItem('identity_user'))
  formAddMember: any
  options: any = {}

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
    this.formAddMember = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email])
    })
  }

  ngOnInit() {
  }

  getHeaders(token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
    return headers
  }

  get correo() {
    return this.formAddMember.get('correo')
  }

  addMember() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : throwError
    this.authService.addMember(this.formAddMember.value, this.options).subscribe(
      (response) => {
        this.toastr.success('', response.mensaje)
        this.resetForm()
      },
      (error) => {
        this.toastr.error('', error.error.mensaje)
        this.resetForm()
      }
    )
  }

  resetForm() {
    this.formAddMember.reset()
  }

}
