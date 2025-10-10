import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDcbService } from '@app/user-dcb/service/user-dcb-service';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-certificate-entry-modal',
  templateUrl: './certificate-entry-modal.component.html',
  styleUrls: ['./certificate-entry-modal.component.css'],
})
export class CertificateEntryModalComponent implements OnInit {
  certificateForm: FormGroup;

  licenseTypes = [
    { value: 'Composite', viewValue: 'COMPOSITE' },
    { value: 'Life', viewValue: 'LIFE' },
    { value: 'General', viewValue: 'GENERAL' },
  ];

  isBranch = false;

  isRole = false;

  isCertificate = false;

  availableBranches = [];

  roles = [
    { id: 2, name: 'ADMIN' },
    { id: 12, name: 'UAM_USER' },
    // { id: 1, name: 'BRANCH_USER' },
  ];
  // { id: 1, name: 'BRANCH_USER' },
  // { id: 13, name: 'CERT_USER' },

  Object = Object;

  heading = '';

  spToBe;

  submitBtn = 'Submit';

  today;

  maxExpiryDate;

  startDate;

  endDateMax;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<CertificateEntryModalComponent>,
    private uamService: UserDcbService,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.today = new Date();
    this.maxExpiryDate = new Date(currentYear + 3, currentMonth, currentDay);
    this.certificateForm = new FormGroup({
      userName: new FormControl(this.data.userName, Validators.required),
      licenseCode: new FormControl(this.data.sp ? this.data.licenseCode?.substring(6) : '', [
        Validators.required,
        Validators.pattern('^[0-9]{6}$'),
      ]),
      searchCtrl1: new FormControl(''),
      licenseStartDate: new FormControl(
        this.data.sp ? this.data.licenseStartDate : '',
        Validators.required,
      ),
      licenseExpiryDate: new FormControl(
        this.data.sp ? this.data.licenseExpiryDate : '',
        Validators.required,
      ),
      licenseType: new FormControl(this.data.sp ? this.data.licenseType : '', Validators.required),
      roleCode: new FormControl('', Validators.required),
      branchCode: new FormControl('', Validators.required),
    });
    console.log('this.data=', this.data);
    if (this.data.api === 'certificate') {
      this.certificateForm.removeControl('roleCode');
      this.certificateForm.removeControl('branchCode');
      this.isCertificate = true;
      this.isRole = false;
      this.isBranch = false;
      this.heading = 'Certificate';
      this.certificateForm.get('userName').setValue(this.data.hrmsNo);

      if (this.data.sp) {
        this.submitBtn = 'Update Details';
      } else {
        this.submitBtn = 'Make as SP User';
      }
    } else if (this.data.api === 'role') {
      this.isRole = true;
      this.isCertificate = false;
      this.isBranch = false;
      this.certificateForm.get('userName').setValue(this.data.empLdaId);
      if (this.data.roleId !== 0) {
        this.roles.push({ id: 1, name: 'BRANCH_USER' });
        this.roles = this.roles.filter((r) => {
          if (r.id !== this.data.roleId) {
            return r;
          }
        });
      } 

      this.certificateForm.removeControl('branchCode');
      this.certificateForm.removeControl('licenseCode');
      this.certificateForm.removeControl('licenseStartDate');
      this.certificateForm.removeControl('licenseExpiryDate');
      this.certificateForm.removeControl('licenseType');

      this.certificateForm.removeControl('sp');
      this.heading = 'Role';
      this.submitBtn = 'Submit';

      this.certificateForm.removeControl('licenseExpiryDate');
    } else if (this.data.api === 'branch') {
      this.isCertificate = false;
      this.isRole = false;
      this.isBranch = true;

      this.certificateForm.get('userName').setValue(this.data.empLdaId);

      this.certificateForm.removeControl('roleCode');
      this.certificateForm.removeControl('licenseCode');
      this.certificateForm.removeControl('licenseStartDate');
      this.certificateForm.removeControl('licenseExpiryDate');
      this.certificateForm.removeControl('sp');
      this.certificateForm.removeControl('licenseType');

      this.certificateForm.removeControl('licenseExpiryDate');
      this.heading = 'Branch';
      this.submitBtn = 'Submit';

      console.log('inside brnach');
      this.uamService.getMasterDcbBranches().subscribe((branches) => {
        let objBranches = branches;

        let valueArr = Object.values(objBranches);
        let keyArr = Object.keys(objBranches);
        this.availableBranches = keyArr.map(function (x, i) {
          return { id: x, value: x + '_' + valueArr[i] };
        });

        // this.availableBranches.push(newObj);
        console.log('avaiulable', keyArr, valueArr);

        // for (let branch in branches) this.availableBranches.push(branch);
      });
      this.submitBtn = 'Submit';
    }
    console.log('avail', this.certificateForm);
  }

  onStartDate() {
    this.startDate = this.certificateForm.get('licenseStartDate').value;

    // this.endDateMax = new Date(new Date().setDate(this.startDate.getDate() + 1));
    this.certificateForm.updateValueAndValidity();
    // console.log('enddate', this.endDateMax);
  }

  updateHandler(updateExistingSp) {
    if (this.data.api === 'role') {
      this.updateRole();
    } else if (this.data.api === 'branch') {
      this.updateBranch();
    } else if (this.data.api === 'certificate') {
      this.updateCertificate(updateExistingSp);
    }
  }

  updateCertificate(updateExistingSp) {
    if (updateExistingSp) {
      this.spToBe = 'true';
    } else {
      this.spToBe = 'false';
    }
    const moment = require('moment');
    let startDate = this.certificateForm.get('licenseStartDate').value;
    let expirydate = this.certificateForm.get('licenseExpiryDate').value;

    // this.secondFormGroup.get('dob').setValue(moment(newDate).format('YYYY-MM-DD'));
    this.certificateForm.get('licenseStartDate').setValue(moment(startDate).format('YYYY-MM-DD'));
    this.certificateForm.get('licenseExpiryDate').setValue(moment(expirydate).format('YYYY-MM-DD'));

    // console.log('time date', this.certificateForm.get('licenseStartDate').value);

    const payload = {
      userName: this.data?.userName,
      sp: this.spToBe,
      licenseCode: this.certificateForm.get('licenseCode')?.value
        ? 'SP0089' + this.certificateForm.get('licenseCode')?.value
        : null,
      licenseStartDate: this.certificateForm.get('licenseStartDate')?.value
        ? this.certificateForm.get('licenseStartDate').value
        : '',
      licenseExpDate: this.certificateForm.get('licenseExpiryDate')?.value
        ? this.certificateForm.get('licenseExpiryDate').value
        : '',
      licenseType: this.certificateForm.get('licenseType')?.value
        ? this.certificateForm.get('licenseType').value
        : '',
    };

    this.loader.showSpinner(true);
    this.uamService.updateCertificate(payload).subscribe(
      (res) => {
        console.log('res', res);
        this.loader.showSpinner(false);
        this.dialogRef.close(res);
      },
      (error) => {
        this.loader.showSpinner(false);
      },
    );
  }

  formValid() {
    if (this.certificateForm.valid) {
      return false;
    } else {
      return true;
    }
  }

  updateRole() {
    this.loader.showSpinner(true);

    const payload = {
      userName: this.data?.userName,
      roleCode: this.certificateForm.get('roleCode').value,
      //  this.certificateForm.get('roleCode').value,
    };
    this.uamService.updateRoleAndBranch(payload).subscribe(
      (res) => {
        console.log('res=', res);
        this.loader.showSpinner(false);

        this.dialogRef.close(res);
      },
      (error) => {
        this.loader.showSpinner(false);
      },
    );
  }

  updateBranch() {
    console.log('res=', this.certificateForm.get('branchCode')?.value);
    this.loader.showSpinner(true);

    const payload = {
      userName: this.data?.userName,
      branchCode: this.certificateForm.get('branchCode').value.toString(),
    };
    this.uamService.updateRoleAndBranch(payload).subscribe(
      (res) => {
        console.log('res=', res);
        this.loader.showSpinner(false);

        this.dialogRef.close(res);
      },
      (error) => {
        this.loader.showSpinner(false);
      },
    );
  }

  disableExpiryDate() {
    if (this.certificateForm.get('licenseStartDate').valid) {
      return false;
    } else return true;
  }
}
