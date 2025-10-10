import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BncaInputErrorComponent } from './bnca-input-error.component';

describe('BncaInputDateComponent', () => {
  let component: BncaInputErrorComponent;
  let fixture: ComponentFixture<BncaInputErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BncaInputErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BncaInputErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
