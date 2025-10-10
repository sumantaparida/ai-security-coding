import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyNumberComponent } from './policy-number.component';

describe('PolicyNumberComponent', () => {
  let component: PolicyNumberComponent;
  let fixture: ComponentFixture<PolicyNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
