import { Component, DoCheck, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-historial',
  templateUrl: './modal-historial.component.html',
  styleUrls: ['./modal-historial.component.css']
})
export class ModalHistorialComponent implements OnInit, DoCheck {

  total: number

  constructor() { }

  @Input() item: any

  ngOnInit() {
  }

  ngDoCheck(): void {
    this.item ? this.getTotal() : null
  }

  getTotal() {
    this.total = 0
    this.item.productos.forEach((producto: any) => {
      this.total += (producto.precio * producto.cantidad)
    })
  }


}
