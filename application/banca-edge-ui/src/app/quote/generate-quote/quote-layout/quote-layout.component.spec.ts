import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteLayoutComponent } from './quote-layout.component';

describe('QuoteLayoutComponent', () => {
  let component: QuoteLayoutComponent;
  let fixture: ComponentFixture<QuoteLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
