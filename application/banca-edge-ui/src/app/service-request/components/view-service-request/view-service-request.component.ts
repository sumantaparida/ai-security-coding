import { Component, OnInit, ViewChild, AfterContentInit, HostListener } from '@angular/core';
import { ServiceRequestDataService } from '../../services/service-request-data.service';
import { Router } from '@angular/router';
import { ServiceRequestModel } from '../../model/service-request-info.model';
import { ServiceRequestResolutionModelComponent } from '../service-request-resolution-model/service-request-resolution-model.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MediaObserver } from '@angular/flex-layout';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { Sort } from '@angular/material/sort';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-view-service-request',
  templateUrl: './view-service-request.component.html',
  styleUrls: ['./view-service-request.component.css'],
  providers: [DatePipe],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewServiceRequestComponent implements OnInit, AfterContentInit {
  panelOpenState = false;

  showDropdown = false;

  value = 'Clear me';

  // complaintData;
  customerArr;

  customerArrCopy;

  serviceRequestArrSearchCopy;

  serviceRequestObject = {};

  serviceRequestObjectCopy = [];

  isDialogOpened = false;

  isStatusClosed = false;

  openServiceRequest = 0;

  closedServiceRequest = 0;

  index;

  date: number = Date.now();

  serviceRequestLength = 0;

  pageSize = 5;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  pageIndex = 0;

  // columnsToDisplay = ['Name', 'Policy Number', 'Status', 'Complaint Against', 'Complaint Mode', 'Nature of Complaint'];
  // columns = ['name', 'policyNumber', 'status', 'complaintAgainst', 'complaintMode', 'complaintNature'];
  columns = [
    ' ',
    'Name',
    'Policy Number',
    'Status',
    'Name of Insurer',
    'Days Open',
    'Nature of Request',
  ];

  expandedElement: ServiceRequestModel | null;

  hidden = false;

  searchForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  sortHeaderData: Sort;

  isLoading = false;

  displayedColumns: string[] = [];

  displayedMobileColumns: string[] = [' ', 'Name', 'Policy Number'];

  innerWidth;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  constructor(
    private serviceRequestDataService: ServiceRequestDataService,
    private router: Router,
    public dialog: MatDialog,
    public media: MediaObserver,
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
    this.loaderService.showSpinner(true);
    this.getComplaints();

    // this.customerArr = this.complaintDataService.getComplaintInfo();
  }

  ngAfterContentInit() {
    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.resetDisplayedColumnsXtraSmall();
  }

  resetDisplayedColumnsXtraSmall() {
    if (this.innerWidth < 820) {
      this.displayedColumns = this.displayedMobileColumns;
      // this.isMobileView = true;
    } else {
      this.displayedColumns = this.columns;
      // this.isMobileView = false;
    }
  }

  sortData(sort: Sort, isSearching?: boolean) {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    // console.log('sorttttt', this.serviceRequestArrSearchCopy);
    if (isSearching && sort !== undefined) {
      this.sortHeaderData = sort;
      this.serviceRequestArrSearchCopy = this.getSearchResults().slice();
      this.customerArrCopy = this.getSortedData();
    } else if (isSearching) {
      this.paginator.pageIndex = 0;
      this.pageIndex = 0;
      this.serviceRequestArrSearchCopy = this.getSearchResults().slice();
      this.customerArrCopy = this.serviceRequestArrSearchCopy.slice(0, this.pageSize);
    } else {
      this.sortHeaderData = sort;
      this.customerArrCopy = [];
      this.customerArr.slice();
      this.serviceRequestArrSearchCopy = this.getSearchResults().slice();
      // console.log('after sorting', this.serviceRequestArrSearchCopy);
      this.customerArrCopy = this.getSortedData();
    }
  }

  getSortedData() {
    const data = this.serviceRequestArrSearchCopy.slice();
    if (
      this.sortHeaderData &&
      (!this.sortHeaderData.active || this.sortHeaderData.direction === '')
    ) {
      this.customerArrCopy = this.serviceRequestArrSearchCopy.slice(this.pageIndex, this.pageSize);
      return this.customerArrCopy;
    }

    this.serviceRequestArrSearchCopy = data.sort((a, b) => {
      const isAsc = this.sortHeaderData.direction === 'asc';
      switch (this.sortHeaderData.active) {
        case 'Name':
          return this.compare(a.customerName, b.customerName, isAsc);
        case 'Policy Number':
          return this.compare(a.policyNo, b.policyNo, isAsc);
        case 'Status':
          return this.compare(a.status, b.status, isAsc);
        case 'Name of Insurer':
          return this.compare(a.insurerName, b.insurerName, isAsc);
        case 'Days Open':
          return this.compare(a.daysOpen, b.daysOpen, isAsc);
        case 'Nature of Request':
          return this.compare(a.requestType, b.requestType, isAsc);
        default:
          return 0;
      }
    });

    return this.serviceRequestArrSearchCopy.slice(this.pageIndex, this.pageSize);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getComplaints() {
    this.serviceRequestDataService.getAllComplaints().subscribe(
      (complaint) => {
        this.loaderService.showSpinner(false);
        // console.log('api returned', complaint);
        this.customerArr = complaint;
        this.customerArr.map((customer) => {
          customer['expanded'] = false;
          customer['cDate'] = new Date(customer.createdDate);
        });
        this.customerArr = this.sortComplaintsByDate(this.customerArr.slice());
        this.serviceRequestArrSearchCopy = this.customerArr.slice();
        this.customerArrCopy = this.customerArr.slice(0, this.pageSize);
        // console.log(this.customerArr.length, 'number of requests');

        this.customerArr.forEach((customer) => {
          if (customer.status === 'Open') {
            this.openServiceRequest++;
          }
        });
        this.customerArr.forEach((customer) => {
          if (customer.status === 'Closed') {
            this.closedServiceRequest++;
          }
        });
        // console.log(this.openServiceRequest, 'open service request');
        // console.log(this.closedServiceRequest, 'close service request');
        // console.log(this.serviceRequestObject, 'lenght of object');
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: error.error.details,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          // navigate
        });
      },
    );
  }

  sortComplaintsByDate(serviceRequestArr) {
    return serviceRequestArr.sort(
      (serviceRequestA, serviceRequestB) => serviceRequestB.cDate - serviceRequestA.cDate,
    );
  }

  toggle(expanded) {
    expanded = !expanded;
  }

  onCreateNewComplaint() {
    this.router.navigate(['/myrequest/register-service-request']);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onSearchFieldChange() {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    this.sortData(this.sortHeaderData, true);
    // this.customerArrCopy = [];
    // this.complaintsArrSearchCopy = [];
    // this.complaintsArrSearchCopy = this.getSearchResults();
    // console.log('the search field', this.complaintsArrSearchCopy);

    // this.customerArrCopy = this.complaintsArrSearchCopy.slice(0, this.pageSize);
    // console.log(this.customerArrCopy);
  }

  getSearchResults() {
    const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    // console.log('search event', searchValue);
    const searchResults = this.customerArr.filter((customer) => {
      if (
        customer.policyNo.match(searchValue) ||
        customer.customerName.match(searchValue) ||
        customer.status.match(searchValue) ||
        customer.insurerName.match(searchValue) ||
        customer.requestType.match(searchValue) ||
        customer.policyNo.toLowerCase().match(searchValue) ||
        customer.customerName.toLowerCase().match(searchValue) ||
        customer.status.toLowerCase().match(searchValue) ||
        customer.insurerName.toLowerCase().match(searchValue) ||
        customer.requestType.toLowerCase().match(searchValue)
      ) {
        return customer;
      }
    });
    return searchResults;
  }

  onToggle(element) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  openDialog(element) {
    const index = this.customerArrCopy.findIndex(
      (complaint) => complaint.policyNumber === element.id,
    );

    if (!this.isDialogOpened) {
      const dialogRef = this.dialog.open(ServiceRequestResolutionModelComponent, {
        panelClass: 'dialog-width',
      });
      dialogRef.afterOpened().subscribe((result) => {
        this.isDialogOpened = true;
        // console.log(`Dialog result: ${result}`);
        // console.log(index, 'index');
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.isDialogOpened = false;
        // console.log('output', res);
        if (res !== '') {
          // console.log('yes im in');
          const data = {
            requestType: element.requestType,
            description: element.description,
            resolutionText: res,
          };
          // this.isLoading = true;
          this.loaderService.showSpinner(true);
          this.serviceRequestDataService
            .resolveComplaints(data, element.id)
            .subscribe((response) => {
              // this.isLoading = false;
              this.loaderService.showSpinner(false);
              this.openServiceRequest = 0;
              this.closedServiceRequest = 0;
              this.getComplaints();
            });
        }
      });
    }
  }

  onPageChange(event: PageEvent) {
    // console.log('page event', event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const serviceRequestToDisplay = event.pageIndex * event.pageSize;
    // console.log(serviceRequestToDisplay);
    this.customerArrCopy = this.serviceRequestArrSearchCopy.slice(
      serviceRequestToDisplay,
      serviceRequestToDisplay + event.pageSize,
    );
  }

  openDocument(url) {
    window.open(url, '_blank');
  }
  // this.dialog.open(ComplaintResolutionModelComponent, {
  //   height: '400px',
  //   width: '600px',
  //   disableClose: false
  // });
}
