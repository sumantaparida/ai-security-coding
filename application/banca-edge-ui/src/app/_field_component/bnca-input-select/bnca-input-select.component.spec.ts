import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BncaInputSelectComponent } from './bnca-input-select.component';

describe('BncaInputSelectComponent', () => {
  let component: BncaInputSelectComponent;
  let fixture: ComponentFixture<BncaInputSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BncaInputSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BncaInputSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
