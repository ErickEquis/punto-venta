import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-notificacion',
  templateUrl: './modal-notificacion.component.html',
  styleUrls: ['./modal-notificacion.component.css']
})
export class ModalNotificacionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() data?: any

}
