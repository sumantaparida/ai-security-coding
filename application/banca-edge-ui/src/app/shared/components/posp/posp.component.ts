import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_services/loader.service';
import { SharedServiceComponent } from '../../services/shared-service';
import { PolicyErrorModalComponent } from '../policy-error-modal/policy-error-modal.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AccountService } from '@app/_services';
import { User } from '@app/_models';
import { FormControl, FormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-posp',
  templateUrl: './posp.component.html',
  styleUrls: ['./posp.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PospComponent implements OnInit {

  pospForm : FormGroup;
  
  user:User

  pospData;

  expandedElement;

  orgCode;

  pageIndex = 0;

  branchCodes;

  pageSize = 5;

  pageSizeOptions = [5, 10];

  branchCode=''

  pospDetails = [];
  reqBody = {
    page: 1,
    size: this.pageSize,
  };

  resultsLength = 0;

  hasPospCourseRoles = false;

  pospCoursesRolesList = ['GI_POSP', 'LI_POSP']
  
  displayedColumns: string[] = [
    'Name',
    'Branch',
    'Gicourse',
    'Giexam',
    'Licourse',
    'Liexam',
    'Action',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private sharedService: SharedServiceComponent,
    private loaderService: LoaderService,
    public dialog: MatDialog,
    public accountService: AccountService
  ) {
    this.accountService.user.subscribe(x => this.user = x);
    
  }


  ngOnInit(): void {
    this.pospForm = new FormGroup({
      branchCode : new FormControl(''),
      searchCtrl : new FormControl(''),
    })
   
    this.hasPospCourseRoles = this.pospCoursesRolesList.every(role=>{
      return this.user['userGroups'].includes(role)
    })
  

    console.log(this.hasPospCourseRoles)
 
      const payload = {
        pageNo: 1,
      pageSize: 5,
      branchCode: this.branchCode
      }
      this.orgCode = this.user.organizationCode
      this.searchPospUser(payload)
  
      this.sharedService.getAllBranchesForUser().subscribe(
        (branches) => { 
          // this.loaderService.showSpinner(false);
          console.log('branches', branches);
          this.branchCodes = branches;
        },
        (error) => {
          this.loaderService.showSpinner(false);
        },
      )
    
    
  }

  generateMagicLink() {
    this.loaderService.showSpinner(true);
    this.sharedService.generateMagicLink().subscribe(
      (res) => {
        this.loaderService.showSpinner(false);

        console.log('response magic', res);
        if (res['returnCode'] == 0) {
          // window.location.href = res['magicLink'];
          window.open(res['magicLink'], '_blank');
        } else {
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: res['returnMessage'],
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            // navigate
          });
        }
      },
      (err) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  onPageChange(event: PageEvent) {
    console.log(event);
    const reqBody = {
      // userName: this.user.userName,
      pageNo: event.pageIndex + 1,
      pageSize: event.pageSize,
      branchCode: this.pospForm.get('branchCode').value,

    };
    this.searchPospUser(reqBody)
  }

  onSearchFieldChange(event){
    this.branchCode=event.value
    const reqBody = {
      // userName: this.user.userName,
      pageNo: 1,
      pageSize: 5,
      branchCode: this.branchCode
    };
    this.searchPospUser(reqBody,true)
   
  }

  searchPospUser (reqBody,filter?) {
    this.loaderService.showSpinner(true);

    this.sharedService.getPospUserList(reqBody).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        console.log('data=', data);
        if (data['returnCode'] === 0) {
        //  if(this.paginator && !pageChange){
        //   this.paginator.pageIndex= 0
        //  }
       
          this.pospData = data
          this.pospDetails = data['pospUsersDetailsDtoList'];
          this.resultsLength = data['totalRecords'];
          if(filter){
           this.paginator.firstPage()
          }
        } else if (data['returnCode'] === 1) {
          this.dialog.open(PolicyErrorModalComponent, {
            data: data['responseMessage'],
            panelClass: 'dialog-width',
          });
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);

        this.dialog.open(PolicyErrorModalComponent, {
          data: error,
          panelClass: 'dialog-width',
        });
      },
    );
  }
 

  downloadFile(url){
    // console.log(url)
    window.open(url,'__blank')
  }
}
