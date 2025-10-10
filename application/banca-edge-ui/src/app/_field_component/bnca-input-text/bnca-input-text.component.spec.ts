import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BncaInputTextComponent } from './bnca-input-text.component';

describe('BncaInputTextComponent', () => {
  let component: BncaInputTextComponent;
  let fixture: ComponentFixture<BncaInputTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BncaInputTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BncaInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
