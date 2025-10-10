import { Component, OnInit, ViewChild, HostListener, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { PolicyVaultService } from '@app/_services/policy-vault.service';
import { CustomerApplications } from '@app/interface/Customer';
import { FormGroup, FormControl } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MediaObserver } from '@angular/flex-layout';
import { LoaderService } from '@app/_services/loader.service';



export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}


@Component({
  selector: 'app-myactivities',
  templateUrl: './myactivities.component.html',
  styleUrls: ['./myactivities.component.css'],
  animations: [
    // trigger('detailExpand', [
    // state('collapsed', style({ height: '0px', minHeight: '0' })),
    // state('expanded', style({ height: '*' })),
    // transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    // ]),
  ]
})

export class MyactivitiesComponent implements OnInit, AfterContentInit {

  customerId: number;
  columnsToDisplay = [' ', 'Creation Date', 'Activity Type', 'Customer Name', 'Activity Description'];
  policyApplicationDetailsArr;
  policyApplicationArrCopy;
  policyApplicationSearchCopy;
  policyDetailString;
  searchForm: FormGroup;
  pageIndex = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  inforceStatusCount = 0;
  pendingStatusCount = 0;
  inactiveStatusCount = 0;



  expandedElement;
  hidden = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sortHeaderData: Sort;
  isLoading = false;
  isMobileView = false;
  innerWidth;
  displayedColumns: string[] = [];
  displayedMobileColumns: string[] = [
    ' ', 'Customer Name', 'Activity Type'
  ];
  isRoutedFromCPage = false;


  constructor(
    private route: ActivatedRoute,
    private policyVaultService: PolicyVaultService,
    public media: MediaObserver,
    private loaderService: LoaderService,
    private breakPointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      if (params.CID) {
        this.customerId = params.CID;
      }
      else {
        this.customerId = null;
      }
    });
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    // this.isMobileView = this.breakPointObserver.isMatched('(max-width: 599px');
    this.searchForm = new FormGroup({
      searchField: new FormControl('')
    });
    // this.getPolicyApplicationDetails();
    this.loaderService.showSpinner(true);
    this.route.queryParams.subscribe(params => {
      // console.log(params, 'p a ra am s');

      if (params.customerId) {
        this.isRoutedFromCPage = true;
      }
      this.customerId = params.customerId;
      // console.log(this.customerId, 'custo m e r i d');
    }

    );
    this.getAllActivities();
  }
  // let timeDiff = Math.abs(Date.now() - this.policyApplicationArrCopy[].getTime());
  // let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  // console.log(age)
  ngAfterContentInit() {

    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.resetDisplayedColumnsXtraSmall();
    // this.isMobileView = this.breakPointObserver.isMatched('(max-width: 599px');

  }

  getAllActivities() {
    this.policyVaultService.getAllActivities().subscribe(activityDetails => {
      this.loaderService.showSpinner(false);
      // console.log('actvities details', activityDetails);
      this.policyApplicationDetailsArr = activityDetails;
      // console.log('actvities details', this.policyApplicationDetailsArr);
      this.formatData();
    }, error => {
      this.loaderService.showSpinner(false);
    });
  }

  formatData() {
    // console.log('after mapping', this.policyApplicationDetailsArr);
    this.policyApplicationSearchCopy = this.policyApplicationDetailsArr.slice();
    this.policyApplicationArrCopy = this.policyApplicationDetailsArr.slice(0, this.pageSize);
    // console.log('policy search array', this.policyApplicationSearchCopy);
  }


  resetDisplayedColumnsXtraSmall() {
    if (this.innerWidth < 820) {
      this.displayedColumns = this.displayedMobileColumns;
      this.isMobileView = true;
    } else {
      this.displayedColumns = this.columnsToDisplay;
      this.isMobileView = false;
    }
  }

  onToggle(element) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  toggle(expanded) {
    expanded = !expanded;
  }

  sortData(sort: Sort, isSearching?: boolean) {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    // console.log('sorttttt', this.policyApplicationSearchCopy);
    if (isSearching && sort !== undefined) {
      this.sortHeaderData = sort;
      this.policyApplicationSearchCopy = this.getSearchResults().slice();
      this.policyApplicationArrCopy = this.getSortedData();
    } else if (isSearching) {
      this.paginator.pageIndex = 0;
      this.pageIndex = 0;
      this.policyApplicationSearchCopy = this.getSearchResults().slice();
      this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(0, this.pageSize);
    } else {
      this.sortHeaderData = sort;
      this.policyApplicationArrCopy = [];
      this.policyApplicationDetailsArr.slice();
      this.policyApplicationSearchCopy = this.getSearchResults().slice();
      console.log('after sorting', this.policyApplicationSearchCopy);
      this.policyApplicationArrCopy = this.getSortedData();
    }
  }

  getSortedData() {
    // console.log('i m in getSorted()');
    const data = this.policyApplicationSearchCopy.slice();
    if (this.sortHeaderData && (!this.sortHeaderData.active || this.sortHeaderData.direction === '')) {
      this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(this.pageIndex, this.pageSize);
      return this.policyApplicationArrCopy;
    }
    this.policyApplicationSearchCopy = data.sort((a, b) => {
      const isAsc = this.sortHeaderData.direction === 'asc';
      switch (this.sortHeaderData.active) {
        case 'Creation Date': return this.compare(a.createdDate, b.createdDate, isAsc);
        case 'Activity Type': return this.compare(a.activityType, b.activityType, isAsc);
        case 'Customer Name': return this.compare(a.customerName, b.customerName, isAsc);
        case 'Activity Description': return this.compare(a.activityDesc, b.activityDesc, isAsc);
        default: return 0;
      }
    });

    return this.policyApplicationSearchCopy.slice(this.pageIndex, this.pageSize);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onSearchFieldChange() {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    this.sortData(this.sortHeaderData, true);
    // this.policyApplicationArrCopy = [];
    // this.policyApplicationSearchCopy = [];
    // this.policyApplicationSearchCopy = this.getSearchResults();
    // console.log('the search field', this.policyApplicationSearchCopy);

    // this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(0, this.pageSize);
    // console.log(this.policyApplicationArrCopy);
  }
  onPageChange(event: PageEvent) {
    // console.log('page event', event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const policiesToDisplay = event.pageIndex * event.pageSize;
    // console.log(policiesToDisplay);
    this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(policiesToDisplay, policiesToDisplay + event.pageSize);
  }


  getSearchResults() {
    const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    // console.log('search event', searchValue);
    const searchResults = this.policyApplicationDetailsArr.filter(policyDetail => {

      const policyDetailString = JSON.stringify(policyDetail);
      if (policyDetailString.match(searchValue) || policyDetailString.toLocaleLowerCase().match(searchValue)) {
        return policyDetail;
      }


    });
    return searchResults;
  }

  showOrHide(column) {
    return this.displayedMobileColumns.indexOf(column) === -1;
  }
  activityLink(url) {
    // window.open(url, '_blank');
    this.router.navigateByUrl(url);
  }

}




