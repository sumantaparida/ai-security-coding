import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteMemberDetailsComponent } from './quote-member-details.component';

describe('QuoteMemberDetailsComponent', () => {
  let component: QuoteMemberDetailsComponent;
  let fixture: ComponentFixture<QuoteMemberDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteMemberDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteMemberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
