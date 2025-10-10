import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteDescriptionVideoComponent } from './quote-description-video.component';

describe('QuoteDescriptionVideoComponent', () => {
  let component: QuoteDescriptionVideoComponent;
  let fixture: ComponentFixture<QuoteDescriptionVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteDescriptionVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteDescriptionVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
