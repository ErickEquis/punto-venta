import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinginPageComponent } from './singin-page.component';

describe('SinginPageComponent', () => {
  let component: SinginPageComponent;
  let fixture: ComponentFixture<SinginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinginPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
