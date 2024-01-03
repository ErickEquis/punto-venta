import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPointPageComponent } from './layout-point-page.component';

describe('LayoutPointPageComponent', () => {
  let component: LayoutPointPageComponent;
  let fixture: ComponentFixture<LayoutPointPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutPointPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutPointPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
