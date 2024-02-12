import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

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
    this.scanEvent.emit()
  }

  scanSuccessHandler(barcode: string) {
    document.getElementById('cerrarScan').click()
    this.scanEvent.emit(barcode);
  }

}
