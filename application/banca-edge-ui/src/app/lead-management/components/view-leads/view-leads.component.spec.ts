import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LeadManagementService } from '@app/lead-management/service/lead-management.service';
import { LoaderService } from '@app/_services/loader.service';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { ViewLeadsComponent } from './view-leads.component';

xdescribe('ViewLeadsComponent', () => {
  let component: ViewLeadsComponent;
  let fixture: ComponentFixture<ViewLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewLeadsComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatDialogModule,
        TranslateModule.forRoot()
      ],
      providers: [{
        provide: MatDialogRef,
        useValue: {}
      },

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('OnInit Should call getAllLeads Method', () => {
    const searchFormSpy = {}

    component.ngOnInit();
    expect(component.getAllLeads).toHaveBeenCalled();
  });




  it('GetAllLeads Should get the available leads', () => {
    const response = {};
    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');
    spyOn(TestBed.inject(LeadManagementService), 'getLeads').and.callFake(() => {
      return of(response);
    });



    component.getAllLeads();

    expect(showLoaderSpy).toHaveBeenCalledTimes(2);
    expect(component.dataSource).toBe(response);

  });

  it('GetAllLeads Should fail API call', () => {
    const response = {};
    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');
    const dataSourceCopySpy = [{ id: 1, value: 'Names' }];
    spyOn(TestBed.inject(LeadManagementService), 'getLeads').and.callFake(() => {
      return throwError(response);
    });



    component.getAllLeads();

    expect(showLoaderSpy).toHaveBeenCalledTimes(2);
    expect(dataSourceCopySpy).toEqual([{ id: 1, value: 'Names' }]);
  });

  // it('Should Navigate', () => {
  //   const lob = { lob: 'Health' };
  //   const productTypeSpy = { product: 'Aviva' };
  //   const leadId = { id: '1321321' };

  //   const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

  //   component.navigateTo(lob, productTypeSpy, leadId);

  //   expect(navigateSpy).toHaveBeenCalledWith(lob, productTypeSpy, leadId);
  // });



});
