import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalScanBarcodeComponent } from './modal-scan-barcode.component';

describe('ModalScanBarcodeComponent', () => {
  let component: ModalScanBarcodeComponent;
  let fixture: ComponentFixture<ModalScanBarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalScanBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalScanBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
