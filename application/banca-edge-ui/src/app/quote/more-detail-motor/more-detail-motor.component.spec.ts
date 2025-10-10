import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreDetailMotorComponent } from './more-detail-motor.component';

describe('MoreDetailMotorComponent', () => {
  let component: MoreDetailMotorComponent;
  let fixture: ComponentFixture<MoreDetailMotorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreDetailMotorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreDetailMotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
