import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePoliciesComponent } from './offline-policies.component';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';

describe('OfflinePoliciesComponent', () => {
  let component: OfflinePoliciesComponent;
  let fixture: ComponentFixture<OfflinePoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfflinePoliciesComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
