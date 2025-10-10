import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthAddInsurerComponent } from './health-add-insurer.component';

describe('HealthAddInsurerComponent', () => {
  let component: HealthAddInsurerComponent;
  let fixture: ComponentFixture<HealthAddInsurerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthAddInsurerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthAddInsurerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
