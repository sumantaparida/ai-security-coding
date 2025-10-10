import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeProtectionComponent } from './life-protection.component';

describe('LifeProtectionComponent', () => {
  let component: LifeProtectionComponent;
  let fixture: ComponentFixture<LifeProtectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeProtectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
