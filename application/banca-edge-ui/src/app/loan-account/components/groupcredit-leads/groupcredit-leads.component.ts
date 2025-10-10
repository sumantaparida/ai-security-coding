import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LeadManagementService } from '@app/lead-management/service/lead-management.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { LoaderService } from '@app/_services/loader.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RecommendService } from '@app/loan-account/service/recommend-service';

import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';

@Component({
  selector: 'app-groupcredit-leads',
  templateUrl: './groupcredit-leads.component.html',
  styleUrls: ['./groupcredit-leads.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupcreditLeadsComponent implements OnInit {
  dataSource;

  columnsToDisplay = [
    ' ',
    'Customer Name',
    'Insurer Name',
    'LOB',
    'Product Type',
    'Date Created',
    'Status',
    'Days Open',
    'Actions',
  ];

  expandedElement;

  searchForm: FormGroup;

  customerArr;

  quoteId;

  openServiceRequest;

  closedServiceRequest;

  customerArrCopy;

  displayedColumns;

  serviceRequestArrSearchCopy;

  pageSize = 5;

  pageSizeOptions;

  dataSourceCopy;

  leadData;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  sortHeaderData: Sort;

  pageIndex;

  loadingError = false;

  constructor(
    public media: MediaObserver,
    private leadManagementService: LeadManagementService,
    private loaderService: LoaderService,
    private router: Router,
    private dailog: MatDialog,
    private recommendService: RecommendService,
  ) {
    this.leadData = this.router.getCurrentNavigation().extras.state;
    console.log('Lead Data', this.leadData);
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
    this.getAllLeads();
  }

  getAllLeads() {
    this.loaderService.showSpinner(false);
    const obj = this.leadData;

    this.dataSource = Object.entries(obj)[0][1];
    // this.leadData.forEach((lead) => {
    //   console.log('INDASDJHAKSDGJHKGASDKJHGASKDGKGDS', lead);
    // });
    this.loaderService.showSpinner(false);

    console.log('PRINTING THIS DATASOURCE', this.dataSource[0]);
    this.serviceRequestArrSearchCopy = this.dataSource.slice();
    this.dataSourceCopy = this.dataSource.slice(0, this.pageSize);

    //   (error) => {
    //     this.loaderService.showSpinner(false);
    //     const message = 'Unable to fetch Data, Please try after sometime.';
    //     this.dailog.open(PolicyErrorModalComponent, {
    //       data: message,
    //       panelClass: 'dialog-width',
    //     });
    //   },
    // );
  }

  onRecommendClick() {
    this.loaderService.showSpinner(true);
    const reqbody = {
      inputType: 2,
      loanAccountNo: this.dataSource[0]?.loanAccountNo,
    };
    this.recommendService.recommendInsuranceDetails(reqbody).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        if (data['responseCode'] === 0 && data['numQuotesExpected'] > 0) {
          this.quoteId = data['quoteId'];
          this.router.navigate(['group-credit', 'loan-quote', this.quoteId]);
        } else {
          const message = data['responseMessage'];
          this.openErrorModal(message);
        }
      },
      () => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to fetch the data';
        this.openErrorModal(message);
      },
    );
  }

  openErrorModal(message: string) {
    throw new Error('Method not implemented.');
  }

  onSearchFieldChange(filterValue: string) {
    this.paginator.firstPage();
    this.dataSource = this.serviceRequestArrSearchCopy.filter((data) =>
      JSON.stringify(data).toLocaleLowerCase().match(filterValue.toLocaleLowerCase()),
    );
    console.log('Data Source', this.dataSource);
    this.dataSourceCopy = this.dataSource.slice(0, this.pageSize);
  }

  sortData(event, value) {}

  onPageChange(event: PageEvent) {
    console.log('Printing Event', event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const policiesToDisplay = event.pageIndex * event.pageSize;
    this.dataSourceCopy = this.serviceRequestArrSearchCopy.slice(
      policiesToDisplay,
      policiesToDisplay + event.pageSize,
    );
  }
}
