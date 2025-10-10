import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BncaInputDateComponent } from './bnca-input-date.component';

describe('BncaInputDateComponent', () => {
  let component: BncaInputDateComponent;
  let fixture: ComponentFixture<BncaInputDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BncaInputDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BncaInputDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
