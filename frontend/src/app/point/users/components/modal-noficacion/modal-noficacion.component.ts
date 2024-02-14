import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-noficacion',
  templateUrl: './modal-noficacion.component.html',
  styleUrls: ['./modal-noficacion.component.css']
})
export class ModalNoficacionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() notificacion?: any

}
