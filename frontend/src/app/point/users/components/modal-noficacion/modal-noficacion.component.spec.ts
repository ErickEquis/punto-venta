import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoficacionComponent } from './modal-noficacion.component';

describe('ModalNoficacionComponent', () => {
  let component: ModalNoficacionComponent;
  let fixture: ComponentFixture<ModalNoficacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNoficacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNoficacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
