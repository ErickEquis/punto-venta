import { Component, Input, OnChanges, OnInit, SimpleChanges, DoCheck, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-scan-barcode',
  templateUrl: './modal-scan-barcode.component.html',
  styleUrls: ['./modal-scan-barcode.component.css']
})
export class ModalScanBarcodeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() camara: boolean
  @Output() scanEvent = new EventEmitter<any>();

  camaraEstatus() {
    this.camara = false
    this.scanEvent.emit('');
  }

  scanSuccessHandler(barcode: string) {
    if (barcode.length > 0) {
      this.scanEvent.emit(barcode);
      document.getElementById('cerrarScan').click()
    }
  }

}
