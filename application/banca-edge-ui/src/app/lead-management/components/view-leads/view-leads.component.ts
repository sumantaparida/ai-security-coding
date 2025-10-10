import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LeadManagementService } from '@app/lead-management/service/lead-management.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { LoaderService } from '@app/_services/loader.service';
import { Router } from '@angular/router';
import { LeadStatusModelComponent } from '../lead-status-model/lead-status-model.component';
import { MatDialog } from '@angular/material/dialog';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { RecommendService } from '@app/loan-account/service/recommend-service';

@Component({
  selector: 'app-view-leads',
  templateUrl: './view-leads.component.html',
  styleUrls: ['./view-leads.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewLeadsComponent implements OnInit {
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

  openServiceRequest;

  closedServiceRequest;

  customerArrCopy;

  displayedColumns;

  serviceRequestArrSearchCopy;

  pageSize = 5;

  pageSizeOptions;

  dataSourceCopy;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  sortHeaderData: Sort;

  pageIndex;

  loadingError = false;

  quoteId;

  constructor(
    public media: MediaObserver,
    private leadManagementService: LeadManagementService,
    private loaderService: LoaderService,
    private router: Router,
    private dailog: MatDialog,
    private recommendService: RecommendService,
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
    this.getAllLeads();
  }

  onRecommendClick(loanNumber) {
    this.loaderService.showSpinner(true);
    const reqbody = {
      inputType: 2,
      loanAccountNo: loanNumber,
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

  openErrorModal(message: any) {
    throw new Error('Method not implemented.');
  }

  getAllLeads() {
    this.loaderService.showSpinner(true);
    this.leadManagementService.getLeads().subscribe(
      (leads) => {
        this.loaderService.showSpinner(false);
        this.dataSource = leads;
        this.serviceRequestArrSearchCopy = this.dataSource.slice();
        this.dataSourceCopy = this.dataSource.slice(0, this.pageSize);
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to fetch Data, Please try after sometime.';
        this.dailog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  navigateTo(lob, productType, leadId, customerId) {
    if (lob.toLocaleLowerCase() === 'health' && productType.toLocaleLowerCase() === 'hosp') {
      this.router.navigate(['/', 'quote', 'health-details', customerId, leadId]);
    } else if (lob.toLocaleLowerCase() === 'fire' && productType.toLocaleLowerCase() === 'home') {
      this.router.navigate(['/', 'quote', 'generate-quote', customerId, leadId]);
    } else if (lob.toLocaleLowerCase() === 'life' && productType.toLocaleLowerCase() === 'endw') {
      this.router.navigate(['/', 'quote', 'saving-traditonal', customerId, leadId]);
    } else if (lob.toLocaleLowerCase() === 'life' && productType.toLocaleLowerCase() === 'term') {
      this.router.navigate(['/', 'quote', 'life-protection', customerId, leadId]);
    } else if (
      lob.toLocaleLowerCase() === 'travel' &&
      productType.toLocaleLowerCase() === 'travel'
    ) {
      this.router.navigate(['/', 'quote', 'travel-details', customerId, leadId]);
    } else if (lob.toLocaleLowerCase() === 'motor' && productType.toLocaleLowerCase() === 'pc') {
      this.router.navigate(['/', 'quote', 'motor-insurance', customerId, leadId]);
    } else if (lob.toLocaleLowerCase() === 'health' && productType.toLocaleLowerCase() === 'pa') {
      this.router.navigate(['/', 'quote', 'personal-accident', customerId, leadId]);
    }
  }

  naviateToOffline(customerId) {
    this.router.navigate(['/offline-policies/new-application', customerId]);
  }

  openDailog(selectedLead) {
    const dialogRef = this.dailog.open(LeadStatusModelComponent, {
      height: '300px',
      width: '400px',
      data: selectedLead,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        selectedLead.status = result.status;
        selectedLead.statusCode = result.statusCode;
        selectedLead.comments = result.comments;
        if (selectedLead.online === false) {
          selectedLead.grossPremium = result.grossPremium;
          selectedLead.policyStartDate = result.policyStartDate;
          selectedLead.policyEndDate = result.policyEndDate;
        }
        this.loaderService.showSpinner(true);
        this.leadManagementService.updateLead(selectedLead).subscribe(
          (date) => {
            this.loaderService.showSpinner(false);
            this.getAllLeads();
          },
          (error) => {
            this.loaderService.showSpinner(false);
          },
        );
      }
    });
  }

  onCreateNewComplaint() {}

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
