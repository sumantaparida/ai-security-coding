import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SibLandingPageComponent } from './sib-landing-page.component';

describe('SibLandingPageComponent', () => {
  let component: SibLandingPageComponent;
  let fixture: ComponentFixture<SibLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SibLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SibLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
