import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrLandingPageComponent } from './qr-landing-page.component';

describe('QrLandingPageComponent', () => {
  let component: QrLandingPageComponent;
  let fixture: ComponentFixture<QrLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
