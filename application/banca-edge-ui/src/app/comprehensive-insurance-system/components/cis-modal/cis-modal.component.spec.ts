import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CisModalComponent } from './cis-modal.component';

describe('CisModalComponent', () => {
  let component: CisModalComponent;
  let fixture: ComponentFixture<CisModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CisModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
