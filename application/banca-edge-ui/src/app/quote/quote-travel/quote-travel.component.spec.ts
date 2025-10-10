import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteTravelComponent } from './quote-travel.component';

describe('QuoteTravelComponent', () => {
  let component: QuoteTravelComponent;
  let fixture: ComponentFixture<QuoteTravelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteTravelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
