import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-editproducto-venta',
  templateUrl: './modal-editproducto-venta.component.html',
  styleUrls: ['./modal-editproducto-venta.component.css']
})
export class ModalEditproductoVentaComponent implements OnInit, OnChanges, DoCheck {

  modal: string = ''
  isDisabledAdd: boolean

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (this.producto) {
      this.producto.cantidad == 1 ? this.modal = 'modal' : this.modal = ''
    }
  }

  ngDoCheck(): void {
    if (this.producto) {
      (this.producto.cantidad == this.producto.stock) ? this.isDisabledAdd = true : this.isDisabledAdd = null
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
