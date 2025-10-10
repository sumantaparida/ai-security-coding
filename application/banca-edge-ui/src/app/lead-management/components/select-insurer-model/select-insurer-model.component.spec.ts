import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LeadManagementService } from '@app/lead-management/service/lead-management.service';
import { of } from 'rxjs';
import { SelectInsurerModelComponent } from './select-insurer-model.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
xdescribe('SelectInsurerModelComponent', () => {
  let component: SelectInsurerModelComponent;
  let fixture: ComponentFixture<SelectInsurerModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectInsurerModelComponent],
      imports: [, HttpClientTestingModule, RouterTestingModule, FormsModule,
        ReactiveFormsModule, MatDialogModule, HttpClientTestingModule],
      providers: [{
        provide: MatDialogRef,
        useValue: {}
      },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectInsurerModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should make API call and store the response', () => {

    const notes = {}

    spyOn(TestBed.inject(LeadManagementService), 'getFromMaster').and.callFake((appNo) => {
      return of(notes);

    });

    component.ngOnInit();

    expect(component.insurerList).toEqual(notes);
  });

});
