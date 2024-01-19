import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal-editproducto-venta',
  templateUrl: './modal-editproducto-venta.component.html',
  styleUrls: ['./modal-editproducto-venta.component.css']
})
export class ModalEditproductoVentaComponent implements OnInit, OnChanges {

  modal: string = ''

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (this.producto) {
      this.producto.cantidad == 1 ? this.modal = 'modal' : this.modal = ''
    }
  }

  @Input() producto?: any
  @Output() editEvent = new EventEmitter<any>();

  edit(n: number) {
    if (this.producto) {
      (n === 0) ? this.editEvent.emit() : ''
      this.producto.cantidad += n
      this.producto.cantidad == 1 ? this.modal = 'modal' : this.modal = '';
      this.producto.cantidad == 0 ? this.editEvent.emit() : ''
    }

  }

}
