import { Component, OnInit, ViewChild, AfterContentInit, HostListener } from '@angular/core';
import { ComplaintDataService } from '../complaint-data.service';
import { Router } from '@angular/router';
import { ComplaintModel } from '../model/complaint-info.model';
import { ComplaintResolutionModelComponent } from '../complaint-resolution-model/complaint-resolution-model.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
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
import { MediaObserver } from '@angular/flex-layout';
import { throwError } from 'rxjs';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';
import moment from 'moment';
// import { MediaObserver, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'app-view-complaints',
  templateUrl: './view-complaint.component.html',
  styleUrls: ['./view-complaint.component.css'],
  providers: [DatePipe],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewComplaintComponent implements OnInit, AfterContentInit {
  panelOpenState = false;

  showDropdown = false;

  value = 'Clear me';

  // complaintData;
  customerArr;

  customerArrCopy;

  complaintsArrSearchCopy;

  complaintsObject = {};

  complaintsObjectCopy = [];

  isDialogOpened = false;

  isStatusClosed = false;

  openComplaints = 0;

  closedComplaints = 0;

  index;

  date: number = Date.now();

  complaintsLength = 0;

  pageSize = 5;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  pageIndex = 0;

  // declaration fro mobile view
  innerWidth;

  displayedColumns: string[] = [];

  isMobileView: boolean;

  columns = [
    ' ',
    'Name',
    'Policy Number',
    'Status',
    'Complaint Against',
    'Days Open',
    'Nature of Complaint',
  ];

  displayedMobileColumns: string[] = [' ', 'Name', 'Policy Number'];

  expandedElement: ComplaintModel | null;

  hidden = false;

  searchForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  sortHeaderData: Sort;

  isLoading = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  constructor(
    private complaintDataService: ComplaintDataService,
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
      this.isMobileView = true;
    } else {
      this.displayedColumns = this.columns;
      this.isMobileView = false;
    }
  }

  sortData(sort: Sort, isSearching?: boolean) {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    console.log('sorttttt', this.complaintsArrSearchCopy);
    if (isSearching && sort !== undefined) {
      this.sortHeaderData = sort;
      this.complaintsArrSearchCopy = this.getSearchResults().slice();
      this.customerArrCopy = this.getSortedData();
    } else if (isSearching) {
      this.paginator.pageIndex = 0;
      this.pageIndex = 0;
      this.complaintsArrSearchCopy = this.getSearchResults().slice();
      this.customerArrCopy = this.complaintsArrSearchCopy.slice(0, this.pageSize);
    } else {
      this.sortHeaderData = sort;
      this.customerArrCopy = [];
      this.customerArr.slice();
      this.complaintsArrSearchCopy = this.getSearchResults().slice();
      console.log('after sorting', this.complaintsArrSearchCopy);
      this.customerArrCopy = this.getSortedData();
    }
  }

  getSortedData() {
    const data = this.complaintsArrSearchCopy.slice();
    if (
      this.sortHeaderData &&
      (!this.sortHeaderData.active || this.sortHeaderData.direction === '')
    ) {
      this.customerArrCopy = this.complaintsArrSearchCopy.slice(this.pageIndex, this.pageSize);
      return this.customerArrCopy;
    }

    this.complaintsArrSearchCopy = data.sort((a, b) => {
      const isAsc = this.sortHeaderData.direction === 'asc';
      switch (this.sortHeaderData.active) {
        case 'Name':
          return this.compare(a.customerName, b.customerName, isAsc);
        case 'Policy Number':
          return this.compare(a.policyNo, b.policyNo, isAsc);
        case 'Status':
          return this.compare(a.complaintStatus, b.complaintStatus, isAsc);
        case 'Complaint Against':
          return this.compare(a.complaintAgainst, b.complaintAgainst, isAsc);
        case 'Days Open':
          return this.compare(a.daysOpen, b.daysOpen, isAsc);
        case 'Nature of Complaint':
          return this.compare(a.complaintNature, b.complaintNature, isAsc);
        default:
          return 0;
      }
    });

    return this.complaintsArrSearchCopy.slice(this.pageIndex, this.pageSize);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getComplaints() {
    this.complaintDataService.getAllComplaints().subscribe(
      (complaint) => {
        this.loaderService.showSpinner(false);
        this.customerArr = complaint;
        this.customerArr.map((customer) => {
          customer['expanded'] = false;
          customer['cDate'] = new Date(customer.createdDate);
        });
        this.customerArr = this.sortComplaintsByDate(this.customerArr.slice());
        this.complaintsArrSearchCopy = this.customerArr.slice();
        this.customerArrCopy = this.customerArr.slice(0, this.pageSize);

        this.customerArr.forEach((customer) => {
          if (customer.complaintStatus === 'Open') {
            this.openComplaints++;
          }
        });
        this.customerArr.forEach((customer) => {
          if (customer.complaintStatus === 'Closed') {
            this.closedComplaints++;
          }
        });
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: error.error.error,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          // navigate
        });
        console.log('error', error);
      },
    );
  }

  sortComplaintsByDate(complaintsArr) {
    return complaintsArr.sort((complaintA, complaintB) =>
      moment(complaintB.cDate).subtract(complaintA.cDate),
    );
  }

  toggle(expanded) {
    expanded = !expanded;
  }

  onCreateNewComplaint() {
    this.router.navigate(['/mycomplaints/register-complaint']);
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
    console.log('search event', searchValue);
    const searchResults = this.customerArr.filter((customer) => {
      if (
        customer.policyNo.match(searchValue) ||
        customer.customerName.match(searchValue) ||
        customer.complaintStatus.match(searchValue) ||
        customer.complaintAgainst.match(searchValue) ||
        customer.receiptMode.match(searchValue) ||
        customer.complaintNature.match(searchValue) ||
        customer.policyNo.toLowerCase().match(searchValue) ||
        customer.customerName.toLowerCase().match(searchValue) ||
        customer.complaintStatus.toLowerCase().match(searchValue) ||
        customer.complaintAgainst.toLowerCase().match(searchValue) ||
        customer.receiptMode.toLowerCase().match(searchValue) ||
        customer.complaintNature.toLowerCase().match(searchValue)
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
      const dialogRef = this.dialog.open(ComplaintResolutionModelComponent, {
        panelClass: 'dialog-width',
      });
      dialogRef.afterOpened().subscribe((result) => {
        this.isDialogOpened = true;
        console.log(`Dialog result: ${result}`);
        console.log(index, 'index');
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.isDialogOpened = false;
        console.log('output', res);
        if (res !== '') {
          console.log('yes im in');
          const data = {
            policyNo: element.policyNo,
            complaintAgainst: element.complaintAgainst,
            receiptMode: element.receiptMode,
            complaintDescription: 'This is a test Complaint',
            complaintNature: element.complaintNature,
            complaintStatus: 'Closed',
            resolutionText: res,
          };
          this.complaintDataService.resolveComplaints(data, element.id).subscribe((response) => {
            console.log('finally changed', data);
            this.getComplaints();
          });
        }
      });
    }
  }

  onPageChange(event: PageEvent) {
    console.log('page event', event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const complaintsToDisplay = event.pageIndex * event.pageSize;
    console.log(complaintsToDisplay);
    this.customerArrCopy = this.complaintsArrSearchCopy.slice(
      complaintsToDisplay,
      complaintsToDisplay + event.pageSize,
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
