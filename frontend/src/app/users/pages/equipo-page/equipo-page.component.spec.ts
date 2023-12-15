import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoPageComponent } from './equipo-page.component';

describe('EquipoPageComponent', () => {
  let component: EquipoPageComponent;
  let fixture: ComponentFixture<EquipoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
