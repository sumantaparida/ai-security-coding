import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '@app/service-request/model/user.model';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { CertificateEntryModalComponent } from './modal/certificate-entry-modal/certificate-entry-modal.component';
import { PopUpMsgComponent } from './modal/pop-up-msg/pop-up-msg.component';
import { UserDcbService } from './service/user-dcb-service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-user-dcb',
  templateUrl: './user-dcb.component.html',
  styleUrls: ['./user-dcb.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserDcbComponent implements OnInit, AfterViewInit {
  // dataSource = ELEMENT_DATA;

  columnsToDisplay = [
    'BranchCode',
    'HRMS No',
    'EMPLDAPUSERID',
    'EMPEMAILID',
    'Department Name',
    'User Role',
    'UserName',
    'Actions',
  ];
  // columnsToDisplay = ['name', 'position', 'weight', 'symbol'];

  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  displayedColumns: string[] = [];

  displayedMobileColumns: string[] = [
    'BranchCode',
    'EMPLDAPUSERID',
    'User Role',
    'EMPEMAILID',
    'Department Name',
    'Actions',
  ];

  expandedElement;

  currentUser;

  dataSource;

  employeesList;

  isAdmin;

  isUamUser;

  isSp;

  isCertUser;

  payload;

  isScheduler = false;

  pageSize = 10;

  pageSizeOptions: number[] = [10];

  totalRecords;

  screenOrientation;

  schdulerTypes = [
    {
      id: 'Resignee',
      value: 'Resignee',
    },
    {
      id: 'NewJoinee',
      value: 'NewJoinee',
    },
  ];

  innerWidth;

  searchForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private accountService: AccountService,
    private uamService: UserDcbService,
    private loaderService: LoaderService,
    public dialog: MatDialog,
    public media: MediaObserver,
  ) {}

  ngOnInit() {
    // this.dataSource = new MatTableDataSource(this.arrayTwo);

    console.log(this.dataSource);
    this.currentUser = this.accountService.userValue;
    console.log('user=', this.currentUser);
    if (this.currentUser.userName === 'ld.rohit@dcbbank.com') {
      this.isScheduler = true;
    }
    this.payload = {
      pageNo: 1,
      pageSize: 10,
      searchData: '',
    };
    this.loaderService.showSpinner(true);
    this.getAllDcbEmployees(false, '');
    this.searchForm = new FormGroup({
      searchData: new FormControl(''),
      hrmsNumber: new FormControl(''),
      schedulerDate: new FormControl(''),
      schedulerName: new FormControl(''),
    });

    this.searchForm
      .get('searchData')
      .valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((event) => {
        this.payload['searchData'] = event.trim();
        this.payload['hrmsNo'] = '';
        this.payload.pageNo = 1;
        this.searchForm.get('hrmsNumber').reset();

        this.uamService.getAllDcbEmployeesPagination(this.payload).subscribe((epmList) => {
          this.loaderService.showSpinner(false);

          if (epmList['returnCode'] === 1) {
            const dialog = this.dialog.open(PopUpMsgComponent, {
              data: {
                message: epmList['returnMessage'],
              },
            });
          } else if (epmList['returnCode'] === 0) {
            this.concatArr(epmList);
          }
          // this.totalRecords = values['totalRecords'];
          // this.policyApplicationDetailsArr = values['customerApplicationDtos'];
        });
      });
    let userGroups = [];
    console.log('amdin', this.currentUser);
    userGroups = this.currentUser.userGroups;
    if (userGroups.includes('ADMIN')) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    if (userGroups.includes('UAM_USER')) {
      this.isUamUser = true;
    } else {
      this.isUamUser = false;
    }

    if (userGroups.includes('CERT_USER')) {
      this.isCertUser = true;
    } else {
      this.isCertUser = false;
    }
  }

  ngAfterContentInit() {
    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
    this.screenOrientation = event.target.screen.orientation.type;
    if (this.screenOrientation === 'landscape-primary') {
      this.resetDisplayedColumnsXtraSmall();
    }
  }

  resetDisplayedColumnsXtraSmall() {
    if (this.innerWidth < 820 && this.screenOrientation === 'portrait-primary') {
      this.displayedColumns = this.displayedMobileColumns;
    } else if (this.innerWidth < 820 && this.screenOrientation === 'landscape-primary') {
      this.displayedColumns = this.columnsToDisplay;
    } else {
      this.displayedColumns = this.columnsToDisplay;
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  getAllDcbEmployees(search, data = '') {
    this.loaderService.showSpinner(true);
    console.log('paytload', this.payload);
    if (search) {
      this.payload['hrmsNo'] = data;
    }
    // this.payload = {
    //   pageNo: 1,
    //   pageSize: 10,
    //   searchData: '',
    // };

    this.uamService.getAllDcbEmployeesPagination(this.payload).subscribe((emloyeeList) => {
      console.log('employeeslist', emloyeeList);
      if (emloyeeList['returnCode'] === 1) {
        this.loaderService.showSpinner(false);
        const dialog = this.dialog.open(PopUpMsgComponent, {
          data: {
            message: emloyeeList['returnMessage'],
          },
        });
      } else if (emloyeeList['returnCode'] === 0) {
        this.employeesList = emloyeeList['dcbEmployeesDto'];
        let userDto = this.employeesList.map((emp) => emp.userDto);
        let dcbEmp = this.employeesList.map((emp) => {
          let st = JSON.stringify(emp.dcbEmpDetails.employee_data);
          let jn = JSON.parse(st);
          let obj = JSON.parse(jn);

          emp['dcbEmpDetails']['employee_data'] = obj;
          // emp['dcbEmpDetails']['EMPLDAPUSERID'] = emp['dcbEmpDetails']['employee_data']?.EMPLDAPUSERID;
          return emp['dcbEmpDetails'];
        });
        dcbEmp.forEach((emp) => {
          emp['EMPLDAPUSERID'] = emp.employee_data?.EMPLDAPUSERID;
          emp['EMPEMAILID'] = emp.employee_data?.EMPEMAILID;
        });

        // let arr3 = arr1.map((item, i) => Object.assign({}, item, arr2[i]));
        let combinedArr = dcbEmp.map((item, i) => Object.assign({}, item, userDto[i]));
        combinedArr.forEach((arr) => {
          arr.fullName = arr.firstName + ' ' + arr.lastName;
        });
        this.totalRecords = emloyeeList['totalRecords'];

        this.dataSource = new MatTableDataSource(combinedArr);

        this.loaderService.showSpinner(false);
        console.log('data source', userDto, dcbEmp, combinedArr);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // if (search) {
        //   this.searchForm.get('searchData').setValue(data);
        //   this.applyFilter(data);
        // }
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    // if (filterValue.includes('')) {
    //   this.dataSource.filter = filterValue.split('');
    // }
    this.payload.searchData = filterValue;
    this.uamService.getAllDcbEmployeesPagination(this.payload).subscribe((emloyeeList) => {
      this.concatArr(emloyeeList);
    });
    // filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // console.log('filter data=', this.dataSource);
  }

  concatArr(emloyeeList) {
    this.employeesList = emloyeeList['dcbEmployeesDto'];
    let userDto = this.employeesList.map((emp) => emp.userDto);
    let dcbEmp = this.employeesList.map((emp) => {
      let st = JSON.stringify(emp.dcbEmpDetails.employee_data);
      let jn = JSON.parse(st);
      let obj = JSON.parse(jn);

      emp['dcbEmpDetails']['employee_data'] = obj;
      // emp['dcbEmpDetails']['EMPLDAPUSERID'] = emp['dcbEmpDetails']['employee_data']?.EMPLDAPUSERID;
      return emp['dcbEmpDetails'];
    });
    dcbEmp.forEach((emp) => {
      emp['EMPLDAPUSERID'] = emp.employee_data?.EMPLDAPUSERID;
      emp['EMPEMAILID'] = emp.employee_data?.EMPEMAILID;
    });

    // let arr3 = arr1.map((item, i) => Object.assign({}, item, arr2[i]));
    let combinedArr = dcbEmp.map((item, i) => Object.assign({}, item, userDto[i]));
    combinedArr.forEach((arr) => {
      arr.fullName = arr.firstName + ' ' + arr.lastName;
    });
    this.totalRecords = emloyeeList['totalRecords'];

    this.dataSource = new MatTableDataSource(combinedArr);

    this.loaderService.showSpinner(false);
  }

  fetchHrms() {
    let hrmsNo = this.searchForm.get('hrmsNumber').value;
    this.loaderService.showSpinner(true);
    this.uamService.fetchEmployeeByHrms(hrmsNo).subscribe(
      (employee) => {
        this.loaderService.showSpinner(false);
        this.resetHrmsNo();
        if (employee['dcbEmpDetails']) {
          const dialog = this.dialog.open(PopUpMsgComponent, {
            data: {
              message: `Employee : ${employee['userDto']['firstName']} ${employee['userDto']['lastName']}`,
            },
          });
          dialog.afterClosed().subscribe(() => {
            this.getAllDcbEmployees(true, hrmsNo);
            // this.applyFilter(employee['userDto']['firstName']);
          });
          console.log('hrmsemp', employee, hrmsNo);
        } else {
          const dialog = this.dialog.open(PopUpMsgComponent, {
            data: {
              message: `${employee['message']}`,
            },
          });
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
    // this.getAllDcbEmployees(true, hrmsNo);
  }

  resetHrmsNo() {
    this.payload['hrmsNo'] = '';
    this.searchForm.get('hrmsNumber').reset();
    this.getAllDcbEmployees(false);
  }

  updateCertificate(
    userName,
    sp,
    licenseCode,
    licenseStartDate,
    licenseExpiryDate,
    licenseType,
    hrmsNo,
  ) {
    let api = 'certificate';
    const dialogRef = this.dialog.open(CertificateEntryModalComponent, {
      data: {
        userName: userName,
        sp: sp,
        api: api,
        licenseCode: sp ? licenseCode : '',
        licenseStartDate: sp ? licenseStartDate : '',
        licenseExpiryDate: sp ? licenseExpiryDate : '',
        licenseType: sp ? licenseType : '',
        hrmsNo: hrmsNo,
      },
      panelClass: 'update-certificate-modal',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const dialog = this.dialog.open(PopUpMsgComponent, {
          data: data,
        });
        dialog.afterClosed().subscribe(() => {
          this.getAllDcbEmployees(false, '');
        });
      }
      // navigate
    });
  }

  updateRole(userName, sp, empLdaId, userGroups) {
    console.log('empLdaId', userGroups);
    let api = 'role';
    let roleId;
    if (userGroups.includes('ADMIN')) {
      roleId = 2;
    } else if (userGroups.includes('UAM_USER') && !userGroups.includes('ADMIN')) {
      roleId = 12;
    } else roleId = 0;
    const dialogRef = this.dialog.open(CertificateEntryModalComponent, {
      data: { userName: userName, sp: sp, api: api, empLdaId: empLdaId, roleId: roleId },
      panelClass: 'update-role-modal',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const dialog = this.dialog.open(PopUpMsgComponent, {
          data: data,
        });
        dialog.afterClosed().subscribe(() => {
          this.getAllDcbEmployees(false, '');
        });
      }
    });
  }

  updateBranch(userName, sp, empLdaId) {
    let api = 'branch';
    const dialogRef = this.dialog.open(CertificateEntryModalComponent, {
      data: { userName: userName, sp: sp, api: api, empLdaId: empLdaId },
      panelClass: 'update-role-modal',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const dialog = this.dialog.open(PopUpMsgComponent, {
          data: data,
        });
        dialog.afterClosed().subscribe(() => {
          this.getAllDcbEmployees(false, '');
        });
      }
    });
  }

  disableAction(userGroup) {
    if (this.isAdmin) {
      return userGroup.includes('UAM_USER') || userGroup.includes('ADMIN');
    }
    return false;
  }

  onPageChange(event) {
    this.loaderService.showSpinner(true);
    // this.pageSize = event.pageSize;
    this.payload['pageNo'] = event.pageIndex + 1;
    this.uamService.getAllDcbEmployeesPagination(this.payload).subscribe((emloyeeList) => {
      this.loaderService.showSpinner(false);

      this.employeesList = emloyeeList['dcbEmployeesDto'];
      let userDto = this.employeesList.map((emp) => emp.userDto);
      let dcbEmp = this.employeesList.map((emp) => {
        let st = JSON.stringify(emp.dcbEmpDetails.employee_data);
        let jn = JSON.parse(st);
        let obj = JSON.parse(jn);

        emp['dcbEmpDetails']['employee_data'] = obj;
        // emp['dcbEmpDetails']['EMPLDAPUSERID'] = emp['dcbEmpDetails']['employee_data']?.EMPLDAPUSERID;
        return emp['dcbEmpDetails'];
      });
      dcbEmp.forEach((emp) => {
        emp['EMPLDAPUSERID'] = emp.employee_data?.EMPLDAPUSERID;
        emp['EMPEMAILID'] = emp.employee_data?.EMPEMAILID;
      });

      // let arr3 = arr1.map((item, i) => Object.assign({}, item, arr2[i]));
      let combinedArr = dcbEmp.map((item, i) => Object.assign({}, item, userDto[i]));
      combinedArr.forEach((arr) => {
        arr.fullName = arr.firstName + ' ' + arr.lastName;
      });

      this.dataSource = new MatTableDataSource(combinedArr);
      this.totalRecords = emloyeeList['totalRecords'];

      // this.policyApplicationDetailsArr = values['customerApplicationDtos'];
      // this.totalRecords = values['totalRecords'];
    });
  }

  scheduler(val) {
    let date = this.searchForm
      .get('schedulerDate')
      .value.toLocaleString('en-GB')
      .slice(0, 10)
      .split('/')
      .reverse()
      .join('-');
    console.log('date=', date);
    let payload = {
      reqDate: date,
      schedulerName: this.searchForm.get('schedulerName').value,
    };
    this.loaderService.showSpinner(true);
    this.uamService.runScheduler(payload).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        console.log('res=', res);
        const dialog = this.dialog.open(PopUpMsgComponent, {
          data: {
            message: res['returnMessage'],
          },
        });
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  checkschedulerValidity() {
    if (this.searchForm.get('schedulerDate').value && this.searchForm.get('schedulerName').value) {
      // console.log('is false');
      return false;
    } else {
      // console.log('is true');
      return true;
    }
  }
}
