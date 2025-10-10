import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkycModalComponent } from './ckyc-modal.component';

describe('CkycModalComponent', () => {
  let component: CkycModalComponent;
  let fixture: ComponentFixture<CkycModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CkycModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkycModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
