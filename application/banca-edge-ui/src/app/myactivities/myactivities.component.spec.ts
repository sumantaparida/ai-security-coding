import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyactivitiesComponent } from './myactivities.component';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';

describe('MyactivitiesComponent', () => {
  let component: MyactivitiesComponent;
  let fixture: ComponentFixture<MyactivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyactivitiesComponent],
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
    fixture = TestBed.createComponent(MyactivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
