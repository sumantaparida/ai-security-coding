import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreDetailAnnuityComponent } from './more-detail-annuity.component';

describe('MoreDetailAnnuityComponent', () => {
  let component: MoreDetailAnnuityComponent;
  let fixture: ComponentFixture<MoreDetailAnnuityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreDetailAnnuityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreDetailAnnuityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
