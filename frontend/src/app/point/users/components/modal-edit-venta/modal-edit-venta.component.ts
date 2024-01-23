import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-edit-venta',
  templateUrl: './modal-edit-venta.component.html',
  styleUrls: ['./modal-edit-venta.component.css']
})
export class ModalEditVentaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() venta: any

}
