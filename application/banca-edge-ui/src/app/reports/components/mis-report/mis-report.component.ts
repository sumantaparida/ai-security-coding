import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReportService } from '@app/reports/reports.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import * as moment from 'moment';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-mis-report',
  templateUrl: './mis-report.component.html',
  styleUrls: ['./mis-report.component.css'],
})
export class MisReportComponent implements OnInit {
  misForm: FormGroup;

  formList: any = [
    {
      controlType: 'searchableDropDown',
      controlName: 'zones',
      label: 'Zones',
      options: [{ id: 123, value: 'karnataka' }],
      getMaster: true,
      masterCode: 'Regional',
      hasCondition: true,
      condition: { type: 'role', value: 'ADMIN' },
    },
    {
      controlType: 'searchableDropDown',
      controlName: 'branches',
      label: 'Branch',
      options: [{ id: 456, value: 'belandur' }],
      getMaster: true,
      masterCode: 'Branch',
      hasCondition: true,
      condition: { type: 'role', value: 'ADMIN' },
    },
    {
      controlType: 'searchableDropDown',
      controlName: 'spCodes',
      label: 'SP',
      options: [{ id: 125376, value: 'Bala' }],
      getMaster: true,
      masterCode: 'SP',
    },
    {
      controlType: 'searchableDropDown',
      controlName: 'insurers',
      label: 'Insurer',
      options: [{ id: 125376, value: 'Bala' }],
      getMaster: true,
      masterCode: 'Insurer',
    },
    {
      controlType: 'searchableDropDown',
      controlName: 'products',
      label: 'Products',
      options: [{ id: 125376, value: 'Bala' }],
      getMaster: true,
      masterCode: 'Product',
    },
    {
      controlType: 'searchableDropDown',
      controlName: 'lob',
      label: 'LOB',
      options: [{ id: 125376, value: 'Bala' }],
      getMaster: true,
      masterCode: 'LOB',
    },
    {
      controlType: 'searchableDropDown',
      controlName: 'status',
      label: 'Status',
      options: [{ id: 125376, value: 'Bala' }],
      getMaster: true,
      masterCode: 'Status',
    },
    {
      controlType: 'select',
      controlName: 'quickInsurer',
      label: 'CIS',
      options: [
        { id: 'Yes', value: 'Yes' },
        { id: 'No', value: 'No' },
      ],
      getMaster: false,
      masterCode: '',
    },
    {
      controlType: 'searchableDropDown',
      controlName: 'leadGenerator',
      label: 'Lead Generator',
      options: [{ id: 125376, value: 'Bala' }],
      getMaster: true,
      masterCode: 'LG',
      hasCondition: true,
      condition: { type: 'fieldDependent', parentControl: 'quickInsurer', value: ['Yes'] },
    },
    {
      controlType: 'text',
      controlName: 'cifId',
      label: 'Customer Id',
      options: [],
      getMaster: false,
      masterCode: '',
    },
    {
      controlType: 'text',
      controlName: 'accountNumber',
      label: 'Account number',
      options: [],
      getMaster: false,
      masterCode: '',
    },
  ];

  formListCopy;

  payload = {
    insurers: [],
    accountNumber: '',
    cifId: '',
    leadGenerator: [],
    products: [],
    status: [],
    zones: [],
    lob: [],
    branches: [],
    spCodes: [],
    quickInsurer: '',
  };

  today = new Date();

  orgCode;

  pageIndex = 0;

  pageSize = 5;

  pageSizeOptions = [5, 10, 15];

  isAdminUser;

  user: User;

  masterSubscription: Subscription;

  allMasterLoaded: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  masterCount = 0;

  misType = [
    { id: 0, value: 'Business MIS Report' },
    // { id: 1, value: 'Commission Report' },
  ];

  bulkReports = [];
  reqBody = {
    page: 1,
    size: this.pageSize,
  };

  resultsLength = 0;
  displayedColumns: string[] = [
    'Start Date',
    'End Date',
    'Requested On',
    'Username',
    'Status',
    'Report Type',
    'Action',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public media: MediaObserver,
    private reportService: ReportService,
    private loaderService: LoaderService,
    public dialog: MatDialog,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.misForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl({ value: '', disabled: true }, Validators.required),
      misType: new FormControl('', Validators.required),
    });
    this.accountService.user.subscribe((user) => {
      this.user = user;
      this.orgCode = this.user?.organizationCode;
      if (this.orgCode === 'KB') {
        this.createForm();
        this.getMastersList();
      }
    });
    this.masterSubscription = this.allMasterLoaded.subscribe((count) => {
      if (count === this.masterCount && count !== 0) {
        this.formListCopy = JSON.parse(JSON.stringify(this.formList));

        this.masterSubscription.unsubscribe();
      }
    });

    if (this.orgCode === 'DCB') {
      console.log('user ==', this.user['userGroups']);
      // let userGroup = this.user['userGroups'];

      this.isAdminUser = this.user['userGroups'].includes('ADMIN') ? true : false;
      let isUamUser =
        !this.user['userGroups'].includes('ADMIN') && this.user['userGroups'].includes('UAM_USER');
      let isSp = false;
      let spVal = this.user.isSP.toString();
      if (spVal == 'true') {
        isSp = true;
      }

      if (this.isAdminUser && !isSp) {
        this.misType.push({ id: 2, value: 'Risk Profile MIS Report' });
      } else {
        this.misType = this.misType.filter((val) => val.id === 0);
      }
      if (isUamUser) {
        this.misType.push({ id: 3, value: 'UAM  Report' });
        this.misType = this.misType.filter((val) => val.id === 3);
      }
    }
    if (this.orgCode !== 'KB') {
      this.getAllReports();
    }

    if (this.orgCode === 'SB') {
      this.misType.push({ id: 1, value: 'Commission Report' });
    }
    if (this.orgCode === 'CSB') {
      this.misType.push({ id: 4, value: 'Opt-Out Leads Report' });
    }
  }

  getAllReports() {
    // this.reqBody.userName = this.user.userName;
    this.loaderService.showSpinner(true);
    this.reportService.getMisReports(this.reqBody).subscribe(
      (report) => {
        this.loaderService.showSpinner(false);
        console.log('report=', report);
        if (report['responseCode'] === 0) {
          this.bulkReports = report['reportList'];
          this.resultsLength = report['records'];
        } else if (report['responseCode'] === 1) {
          this.dialog.open(PolicyErrorModalComponent, {
            data: report['responseMessage'],
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
  onPageChange(event: PageEvent) {
    console.log(event);
    const reqBody = {
      // userName: this.user.userName,
      page: event.pageIndex + 1,
      size: event.pageSize,
    };
    this.loaderService.showSpinner(true);

    this.reportService.getMisReports(reqBody).subscribe(
      (report) => {
        this.loaderService.showSpinner(false);
        console.log('report=', report);
        if (report['responseCode'] === 0) {
          this.bulkReports = report['reportList'];
          this.resultsLength = report['records'];
        } else if (report['responseCode'] === 1) {
          this.dialog.open(PolicyErrorModalComponent, {
            data: report['responseMessage'],
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

  inputEndDate(date) {
    const moment = require('moment');
    const newDate = new Date(date.value);
    this.misForm.get('endDate').setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  inputStartDate(date) {
    this.enableEndDate();
    const moment = require('moment');
    const newDate = new Date(date.value);
    // this.maxEndDate(newDate);

    this.misForm.get('startDate').setValue(moment(newDate).format('YYYY-MM-DD'));
  }

  // maxEndDate(date) {
  //   const currentYear = new Date(date).getFullYear();
  //   const currentMonth = new Date(date).getMonth();
  //   const currentDay = new Date(date).getDate();
  //   console.log('current year', currentYear);
  //   console.log('current month', currentMonth);
  //   console.log('current day', currentDay);
  //   if (new Date(currentYear, currentMonth, currentDay + 30) > this.today) {
  //     this.maxEnd = this.today;
  //     console.log('117', this.maxEnd);
  //   } else {
  //     this.maxEnd = new Date(currentYear, currentMonth, currentDay + 30);
  //     console.log('118', this.maxEnd);
  //   }
  // }

  minEndDate() {
    return new Date(this.misForm.get('startDate').value);
  }

  enableEndDate() {
    if (this.misForm.get('startDate').value !== null) {
      console.log('131');
      this.misForm.get('endDate').enable();
      this.misForm.get('endDate').setValue('');
    } else {
      console.log('132');
      this.misForm.controls.endDate.disable();
    }
    console.log('133');
  }

  getMisReport() {
    this.loaderService.showSpinner(true);
    console.log(this.misForm);
    let data = {
      orgCode: this.user.organizationCode,
      startDate: this.misForm.get('startDate').value,
      endDate: this.misForm.get('endDate').value,
      insurerId: this.user.insurerId,
      insurerUser: this.user.insurerUser,
      branchCode: '',
    };

    if (!this.isAdminUser) {
      data.branchCode = this.user.branchCode;
    }
    if (this.orgCode === 'KB') {
      data = { ...data, ...this.payload };
      console.log(data);
    }
    this.reportService.getMISReport(data).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        if (res['responseCode'] === 0) {
          // if (res['records'] > 0) {
          //   if (res['reportUrl']) {
          //     window.open(res['reportUrl'], '_blank');
          //   } else if (res['responseData']) {
          //     const fileName = this.generateFileName();
          //     this.base64ToXslx(res['responseData'], fileName);
          //   }
          // } else {
          let dialogBox = this.dialog.open(PolicyErrorModalComponent, {
            data: res['responseMessage'],
            panelClass: 'dialog-width',
          });
          dialogBox.afterClosed().subscribe((data) => {
            this.getAllReports();
          });
          // }
        } else {
          this.dialog.open(PolicyErrorModalComponent, {
            data: res['responseMessage'],
            panelClass: 'dialog-width',
          });
        }

        console.log('respon=', res);
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  generateFileName(reportType) {
    let orgCode = '';
    this.accountService.user.subscribe((user) => {
      console.log(user);
      orgCode = user?.organizationCode;
    });

    const date = moment(new Date(Date.now())).format('YYYYMMDD');
    const randomNumber = Math.random().toString().split('.')[1].substring(0, 9);
    const fileName =
      // this.misForm.get('misType').value == 0
      `${reportType}${orgCode}_${date}${randomNumber}`;
    // : `CommissionReport_${orgCode}_${date}${randomNumber}`;
    return fileName;
  }

  getCommissionMISReport() {
    this.loaderService.showSpinner(true);
    const data = {
      orgCode: this.user.organizationCode,
      startDate: this.misForm.get('startDate').value,
      endDate: this.misForm.get('endDate').value,
      insurerId: this.user.insurerId,
      insurerUser: this.user.insurerUser,
      branchCode: '',
    };
    if (!this.isAdminUser) {
      data.branchCode = this.user.branchCode;
    }
    this.reportService.getCommissionMISReport(data).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        if (res['responseCode'] === 0) {
          // if (res['records'] > 0) {
          //   if (res['reportUrl']) {
          //     window.open(res['reportUrl'], '_blank');
          //   } else if (res['responseData']) {
          //     const fileName = this.generateFileName();
          //     this.base64ToXslx(res['responseData'], fileName);
          //   }
          // } else {
          let dialogBox = this.dialog.open(PolicyErrorModalComponent, {
            data: res['responseMessage'],
            panelClass: 'dialog-width',
          });
          dialogBox.afterClosed().subscribe((data) => {
            this.getAllReports();
          });

          // }
        } else {
          this.dialog.open(PolicyErrorModalComponent, {
            data: res['responseMessage'],
            panelClass: 'dialog-width',
          });
        }
        console.log('respon=', res);
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  onSubmit() {
    console.log('vslue', this.misForm.get('misType').value);
    if (this.misForm.get('misType').value === 0) {
      this.getMisReport();
    } else if (this.misForm.get('misType').value == 1) {
      this.getCommissionMISReport();
    } else if (this.misForm.get('misType').value == 2) {
      this.getRiskProfileReport();
    } else if (this.misForm.get('misType').value == 3) {
      this.getUamReport();
    } else if (this.misForm.get('misType').value == 4) {
      this.getOptOutReport();
    }
  }

  enableSubmit() {
    if (this.misForm.valid) {
      return false;
    } else {
      return true;
    }
  }

  getRiskProfileReport() {
    const data = {
      orgCode: this.user.organizationCode,
      startDate: this.misForm.get('startDate').value,
      endDate: this.misForm.get('endDate').value,
      insurerId: this.user.insurerId,
      insurerUser: this.user.insurerUser,
      branchCode: '',
    };
    if (!this.isAdminUser) {
      data.branchCode = this.user.branchCode;
    }
    this.loaderService.showSpinner(true);

    this.reportService.fetchMisRiskReport(data).subscribe(
      (res) => {
        console.log('reports', res);
        this.loaderService.showSpinner(false);

        if (res['responseCode'] === 0) {
          // if (res['records'] > 0) {
          //   if (res['reportUrl']) {
          //     window.open(res['reportUrl'], '_blank');
          //   } else if (res['responseData']) {
          //     const fileName = this.generateFileName();
          //     this.base64ToXslx(res['responseData'], fileName);
          //   }
          // } else {
          let dialogBox = this.dialog.open(PolicyErrorModalComponent, {
            data: res['responseMessage'],
            panelClass: 'dialog-width',
          });
          dialogBox.afterClosed().subscribe((data) => {
            this.getAllReports();
          });
          // }
        } else {
          this.dialog.open(PolicyErrorModalComponent, {
            data: res['responseMessage'],
            panelClass: 'dialog-width',
          });
        }
        // if (reports !== 'No Records found for Search Criteria' && reports !== '') {
        //   this.base64ToXslx(reports.toString());
        // } else {
        //   this.dialog.open(PolicyErrorModalComponent, {
        //     data: 'No Records found for Search Criteria',
        //     panelClass: 'dialog-width',
        //   });
        // }
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  getUamReport() {
    this.loaderService.showSpinner(true);
    this.reportService.downloadUamReport('').subscribe((report) => {
      console.log(report.toString());
      const randomNumber = Math.random().toString().split('.')[1].substring(0, 9);
      const filename = `UAMReport_${randomNumber}`;
      this.loaderService.showSpinner(false);

      this.base64ToXslx(report.toString(), filename);
    });
  }

  getOptOutReport() {
    this.loaderService.showSpinner(true);
    const data = {
      orgCode: this.user.organizationCode,
      startDate: this.misForm.get('startDate').value,
      endDate: this.misForm.get('endDate').value,
    };
    this.reportService.getOptOutMISReport(data).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        if (res['responseCode'] === 0) {
          let dialogBox = this.dialog.open(PolicyErrorModalComponent, {
            data: res['responseMessage'],
            panelClass: 'dialog-width',
          });
          dialogBox.afterClosed().subscribe((data) => {
            this.getAllReports();
          });
        } else {
          this.dialog.open(PolicyErrorModalComponent, {
            data: res['responseMessage'],
            panelClass: 'dialog-width',
          });
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  base64ToPdf(data) {
    const byte64Data = data;
    const byteArray = new Uint8Array(
      atob(byte64Data)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    // Here is your URL you can use
    const url = window.URL.createObjectURL(blob);
    console.log('url-->', url);
    window.open(url, '_blank');
  }

  // base64ToXsls(data) {
  //   var mediaType =
  //     'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
  //   // var userInp = document.getElementById('base64input');
  //   var a = document.createElement('a');
  //   a.href = mediaType + data;
  //   //a.href = mediaType+userInp;
  //   a.download = 'filename.xlsx';
  //   a.textContent = 'Download file!';
  //   document.body.appendChild(a);
  // }

  base64ToXslx(data, fileName?) {
    let contentType = 'application/vnd.ms-excel';
    let blob1 = this.b64toBlob(data, contentType);
    let blobUrl1 = URL.createObjectURL(blob1);
    if (fileName) {
      var downloadLink = document.createElement('a');
      downloadLink.href = blobUrl1;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      window.open(blobUrl1);
    }
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  createForm() {
    this.formList.forEach((form) => {
      this.misForm.addControl(form.controlName, new FormControl(''));
    });
    console.log(this.misForm);
  }

  getMastersList() {
    this.formList.forEach((form) => {
      form.getMaster ? this.masterCount++ : (this.masterCount = this.masterCount);
    });
    let count = 0;
    this.formList.forEach((form) => {
      if (form.getMaster) {
        this.reportService.getMaster(form.masterCode).subscribe(
          (options: []) => {
            if (options.length > 0) {
              form.options = options;
              count++;
              this.allMasterLoaded.next(count);
            }
          },
          (err) => {
            console.log(err);
            form.options = [
              { id: 123, value: 'Karnataka' },
              { id: 167, value: 'GOA' },
              { id: 827, value: 'tamilnadu' },
              { id: 234234, value: 'kerala' },
              { id: 918729, value: 'bengal' },
              { id: 826819, value: 'andhra' },
              { id: 97268, value: 'sikim' },
              { id: 635728, value: 'jammu' },
              { id: 97257, value: 'rajasthan' },
            ];
            count++;
            this.allMasterLoaded.next(count);
          },
        );
      }
    });
  }

  onSearch(event, form) {
    let selectedOptions = [];
    let reqOptions = this.formList.find(
      (actForm) => actForm.controlName === form.controlName,
    ).options;
    if (this.misForm.get(form.controlName)?.value?.length > 0) {
      this.misForm.get(form.controlName).value.forEach((value) => {
        reqOptions.forEach((options) => {
          if (options.id === value) {
            selectedOptions.push(options);
          }
        });
      });
      console.log(selectedOptions);
    }
    reqOptions = reqOptions.filter((option) => {
      if (
        selectedOptions.findIndex((selectedOption) => {
          return selectedOption.id == option.id;
        }) > -1
      ) {
        return true;
      }
      return Object.values(option)
        .toString()
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    form.options = reqOptions;
  }

  onSelectionChanged(controlName, event) {
    if (controlName === 'branches') {
      this.reportService.getMasterName('SP', this.misForm.get(controlName).value).subscribe(
        (res) => {
          this.formListCopy.find((form) => form.controlName === 'spCodes').options = res;
        },
        (err) => {
          console.log(err);
        },
      );
      this.reportService.getMasterName('LG', this.misForm.get(controlName).value).subscribe(
        (res) => {
          this.formListCopy.find((form) => form.controlName === 'leadGenerator').options = res;
        },
        (err) => {
          console.log(err);
        },
      );
    }
    if (controlName === 'zones') {
      this.reportService.getBranchList(this.misForm.get(controlName).value).subscribe(
        (res) => {
          this.formListCopy.find((form) => form.controlName === 'branches').options = res;
        },
        (err) => {
          console.log(err);
        },
      );
    }
    this.payload[controlName] = this.misForm.get(controlName).value;
  }

  onDataChanged(controlName, event) {
    this.payload[controlName] = this.misForm.get(controlName).value;
  }

  reportType(event) {
    console.log('evnt', event);
    let val = event.value;
    if (val == '3') {
      this.misForm.get('startDate').disable();
      this.misForm.get('endDate').disable();
    }
  }

  deselectAll(controlName) {
    this.misForm.get(controlName).reset();
  }

  downloadFile(fileData, reportType) {
    const fileName = this.generateFileName(reportType);
    this.base64ToXslx(fileData, fileName);
  }
}
