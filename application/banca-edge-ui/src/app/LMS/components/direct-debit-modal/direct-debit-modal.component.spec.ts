import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectDebitModalComponent } from './direct-debit-modal.component';

describe('DirectDebitModalComponent', () => {
  let component: DirectDebitModalComponent;
  let fixture: ComponentFixture<DirectDebitModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectDebitModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectDebitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
