import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BncaInputRadioComponent } from './bnca-input-radio.component';

describe('BncaInputRadioComponent', () => {
  let component: BncaInputRadioComponent;
  let fixture: ComponentFixture<BncaInputRadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BncaInputRadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BncaInputRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
