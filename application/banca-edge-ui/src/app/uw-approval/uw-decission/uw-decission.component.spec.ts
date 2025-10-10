import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ParamMap, Params, convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';
import { of, ReplaySubject, throwError } from 'rxjs';
import { UwService } from './services/uw.service';

import { UwDecissionComponent } from './uw-decission.component';

class ActivatedRouteStub {
  private subject = new ReplaySubject<ParamMap>();

  constructor() {
    this.setParamMap({
      customerName: 'Sunjith',
      productName: 'Aviva',
      appNo: '20965660044'
    });
  }

  /** The mock paramMap observable */
  readonly params = this.subject.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params) {
    this.subject.next(params);
  }
}

fdescribe('UwDecissionComponent', () => {
  let component: UwDecissionComponent;
  let fixture: ComponentFixture<UwDecissionComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UwDecissionComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        MatDialog,
        LoaderService,
        UwService,
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UwDecissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('OnNgOnit', () => {

    const uwCodesresponse = [{
      id: '1',
      value: 'Accepted'

    },
    {
      id: '2',
      value: 'Rejected'

    }, {
      id: '1',
      value: 'Accepted with Loading'

    }];

    const appResponse = {
      applicationNo: '20965660044'
    };

    const getNotesSpy = spyOn(component, 'getNotes');

    spyOn(TestBed.inject(UwService), 'getUwDecission').and.callFake(() => {
      return of(uwCodesresponse);
    });

    spyOn(TestBed.inject(UwService), 'getApplicationDetails').and.callFake(() => {
      return of(appResponse);
    });

    component.uwDecisionForm.get('uwDecision').setValue('3');

    component.ngOnInit();

    expect(component.uwDecisionMaster).toEqual(uwCodesresponse);
    expect(component.applicationDetails).toEqual(appResponse);
    expect(getNotesSpy).toHaveBeenCalled();
    expect(component.uwDecisionForm.contains('additionalPremium')).toBeTruthy();
  });

  it('OnNgOnit Else', () => {

    const uwCodesresponse = [{
      id: '1',
      value: 'Accepted'

    },
    {
      id: '2',
      value: 'Rejected'

    }, {
      id: '1',
      value: 'Accepted with Loading'

    }];

    const appResponse = {
      applicationNo: '20965660044'
    };

    const getNotesSpy = spyOn(component, 'getNotes');

    spyOn(TestBed.inject(UwService), 'getUwDecission').and.callFake(() => {
      return of(uwCodesresponse);
    });

    spyOn(TestBed.inject(UwService), 'getApplicationDetails').and.callFake(() => {
      return throwError(appResponse);
    });

    component.uwDecisionForm.get('uwDecision').setValue('6');



    component.ngOnInit();

    expect(component.uwDecisionMaster).toEqual(uwCodesresponse);
    expect(component.applicationDetails).toEqual(undefined);
    expect(getNotesSpy).toHaveBeenCalled();
    expect(component.uwDecisionForm.contains('additionalPremium')).toBeFalse();

  });

  it('Should make API call and store the response', () => {

    const notes = [{
      value: 'Additional Premium',
    }];



    spyOn(TestBed.inject(UwService), 'getNotes').and.callFake((appNo) => {
      return of(notes);

    });

    component.getNotes();

    expect(component.applicationNotes).toEqual(notes);
  });

  it('Should make API call and trow Error', () => {

    const notes = [{
      value: 'Additional Premium',
    }];



    spyOn(TestBed.inject(UwService), 'getNotes').and.callFake((appNo) => {
      return throwError(notes);

    });

    component.getNotes();

    expect(component.applicationNotes).toBe(undefined);
  });



  it('onSave Decission make API call and store the response', () => {
    const response = {};

    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');
    spyOn(TestBed.inject(UwService), 'saveDecision').and.callFake((reqBody) => {
      return of(response);
    });

    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

    spyOn(component.dialog, 'open')
      .and
      .returnValue({ afterClosed: () => of(true) } as MatDialogRef<typeof component>);

    component.saveDecission();

    expect(showLoaderSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenCalled();

  });

  it('onSave Decission make API call and Throw Error', () => {
    const response = {};

    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');

    spyOn(TestBed.inject(UwService), 'saveDecision').and.callFake((reqBody) => {
      return throwError(response);
    });

    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

    spyOn(component.dialog, 'open')
      .and
      .returnValue({ afterClosed: () => of(true) } as MatDialogRef<typeof component>);

    component.saveDecission();

    expect(showLoaderSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenCalledTimes(0);

  });

  it('Should Open Dailog with value', () => {
    const response = {};

    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');

    spyOn(component.dialog, 'open')
      .and
      .returnValue({ afterClosed: () => of('name') } as MatDialogRef<typeof component>);

    spyOn(TestBed.inject(UwService), 'addNotes').and.callFake((reqBody) => {
      return of(response);
    });


    component.openDailog();

    expect(showLoaderSpy).toHaveBeenCalledTimes(3);

  });


  it('Should Open Dailog with Error', () => {
    const response = {};
    const uwPoliciesSpy = {};
    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');

    spyOn(component.dialog, 'open')
      .and
      .returnValue({ afterClosed: () => of('name') } as MatDialogRef<typeof component>);

    spyOn(TestBed.inject(UwService), 'addNotes').and.callFake((reqBody) => {
      return throwError(response);
    });


    component.openDailog();

    expect(showLoaderSpy).toHaveBeenCalledTimes(2);
    expect(uwPoliciesSpy).toEqual(response);
  });


});
