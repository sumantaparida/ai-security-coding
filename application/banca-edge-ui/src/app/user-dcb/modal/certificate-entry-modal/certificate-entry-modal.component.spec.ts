import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateEntryModalComponent } from './certificate-entry-modal.component';

describe('CertificateEntryModalComponent', () => {
  let component: CertificateEntryModalComponent;
  let fixture: ComponentFixture<CertificateEntryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateEntryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
