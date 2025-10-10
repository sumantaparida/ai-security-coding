import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreDetailsHealthComponent } from './more-details-health.component';

describe('MoreDetailsHealthComponent', () => {
  let component: MoreDetailsHealthComponent;
  let fixture: ComponentFixture<MoreDetailsHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreDetailsHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreDetailsHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
