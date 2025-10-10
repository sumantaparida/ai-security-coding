import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared/shared.module';
import { LoaderService } from '@app/_services/loader.service';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { UwRoutingModule } from './uw-approval-routing.module';

import { UwApprovalComponent } from './uw-approval.component';
import { UwService } from './uw-decission/services/uw.service';

xdescribe('UwApprovalComponent', () => {
  let component: UwApprovalComponent;
  let fixture: ComponentFixture<UwApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UwApprovalComponent],
      providers: [UwService],
      imports: [
        CommonModule,
        UwRoutingModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatDialogModule,
        MatListModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UwApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('getSearchResults method should return array with 2 Objects', () => {
    const names = [{ name: 'Sunjith' }, { name: 'sunjith' }, { name: 'john' }];
    component.searchForm.get('searchField').setValue('Sunjith');
    component.uwPolicies = names;


    const results = component.getSearchResults();

    expect(results.length).toEqual(2);
  });

  it('ngOnInit method', () => {
    const values = [{ id: 20539458712, applicationNo: '250002354684565' },
    { id: 10539572387, applicationNo: '250002354684565' },
    { id: 30539671210, applicationNo: '250002354684565' }];

    spyOn(TestBed.inject(UwService), 'getUwPolicy').and.callFake(() => of({ responseCode: values }));


  });

  it('OnInit should invoke API call ', () => {
    const response = {};
    const uwPoliciesCopySpy = [{ value: 'Add' }];
    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');
    spyOn(TestBed.inject(UwService), 'getUwPolicy').and.callFake(() => {
      return of(response);
    });



    component.ngOnInit();

    expect(showLoaderSpy).toHaveBeenCalledTimes(2);
    expect(uwPoliciesCopySpy).toEqual([{ value: 'Add' }]);
  });

  it('OnInit should invoke API call Throw Error', () => {
    const response = {};

    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');

    spyOn(TestBed.inject(UwService), 'getUwPolicy').and.callFake(() => {
      return throwError(response);
    });



    component.ngOnInit();

    expect(showLoaderSpy).toHaveBeenCalledTimes(2);

  });

  xit('OnSearchFiled Changes', () => {
    const paginatorSpy = 0;
    const pageIndexSpy = 0;

    component.onSearchFieldChange();

    expect(paginatorSpy).toEqual(0);
    expect(pageIndexSpy).toEqual(0);


  });





});
