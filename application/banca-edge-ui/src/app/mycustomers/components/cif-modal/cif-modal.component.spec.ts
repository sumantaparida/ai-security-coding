import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CifModalComponent } from './cif-modal.component';

describe('CifModalComponent', () => {
  let component: CifModalComponent;
  let fixture: ComponentFixture<CifModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CifModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CifModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
