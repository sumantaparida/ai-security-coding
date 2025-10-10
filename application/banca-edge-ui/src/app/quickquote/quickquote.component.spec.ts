import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickquoteComponent } from './quickquote.component';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';

describe('QuickquoteComponent', () => {
  let component: QuickquoteComponent;
  let fixture: ComponentFixture<QuickquoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickquoteComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{ CID: 1 }]),
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickquoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
