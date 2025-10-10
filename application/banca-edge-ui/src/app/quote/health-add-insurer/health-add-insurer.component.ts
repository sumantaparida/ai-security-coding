import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../health-hospitalization/health-hospitalization.component';
import { QuoteService } from '../quote.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '@app/shared/utils/moment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-health-add-insurer',
  templateUrl: './health-add-insurer.component.html',
  styleUrls: ['./health-add-insurer.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HealthAddInsurerComponent implements OnInit {
  productType;

  isAgeErro = false;

  today = new Date();

  primaryMemberList;

  primaryMemberForm: FormGroup;

  selectedMember;

  addedInsurer = {
    relationshipId: '',
    rating: '',
    gender: '',
    dob: '',
    relation: '',
    maritalStatus: '',
    occupation: '',
    id: '',
  };

  customerId;

  isDependentList;

  filterDependent;

  customerDetails;

  addedDependents;

  disabled = false;

  addedUserId;

  removedMemberList;

  isPersonalAccident = false;

  showSmoker = true;

  occupationOption;

  remainingDependentList;

  @ViewChild('investpre') PropInvest: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<HealthAddInsurerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private quoteService: QuoteService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.productType = this.data.name;
    // this.quoteService.getInsuredRelationship('Health', this.productType).subscribe(relationship => {
    //   this.primaryMemberList = relationship;
    // });
    // console.log(this.data['primaryMemberList']);
    this.primaryMemberList = this.data['primaryMemberList'];
    this.removedMemberList = this.data['removedMemberList'];
    this.customerDetails = this.data['customerDetails'];
    this.customerId = this.data['customerId'];
    // console.log('customer dstauls', this.customerDetails);
    this.primaryMemberForm = new FormGroup({
      primaryMember: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      smoker: new FormControl('', Validators.required),
      customerDependentList: new FormControl(''),
    });
    if (this.router.url.indexOf('/quote/travel-details') > -1) {
      // console.log('travel');
      this.showSmoker = false;
      this.primaryMemberForm.removeControl('smoker');
    } else if (
      this.router.url.indexOf('/quote/personal-accident') > -1 ||
      this.router.url.indexOf('/quote/pa-insurance') > -1
    ) {
      this.showSmoker = false;
      this.isPersonalAccident = true;
      this.primaryMemberForm.addControl('occupation', new FormControl('', Validators.required));
      this.primaryMemberForm.addControl('maritalStatus', new FormControl('', Validators.required));
      this.primaryMemberForm.removeControl('smoker');
      this.quoteService.getPAOccupation().subscribe((res) => {
        this.occupationOption = res;
      });
    }

    if (this.primaryMemberList !== undefined && this.primaryMemberList.length === 1) {
      this.primaryMemberForm.get('primaryMember').setValue(this.primaryMemberList[0].id);
      this.primaryMemberForm.get('primaryMember').disable();
    }

    if (this.customerId !== 0) {
      if (this.removedMemberList !== undefined && this.removedMemberList.length >= 0) {
        this.primaryMemberList.push(this.removedMemberList);
        this.primaryMemberList = [].concat.apply([], this.primaryMemberList);
        this.primaryMemberList = this.primaryMemberList.filter(
          (element, i) => i === this.primaryMemberList.indexOf(element),
        );
        this.primaryMemberList = this.primaryMemberList.sort((a, b) => {
          return a.id - b.id;
        });
      }
      // --needded--
      if (this.customerDetails?.dependentList) {
        this.isDependentList = true;
        this.primaryMemberForm.valueChanges.subscribe((checked) => {
          if (checked.primaryMember) {
            this.filterDependent = this.customerDetails?.dependentList.filter((arr) => {
              if (arr.relationshipType === checked.primaryMember) {
                return arr;
              }
            });
            this.selectedMember = this.primaryMemberForm.get('customerDependentList').value;
            // console.log('value of selected', this.selectedMember);
            this.remainingDependentList = this.customerDetails?.dependentList.filter((arr) => {
              if (arr.id !== this.selectedMember.id) {
                // console.log('inside if');
                return arr;
              }
            });

            if (checked.customerDependentList.relationshipType === checked.primaryMember) {
              this.primaryMemberForm
                .get('dob')
                .setValue(checked.customerDependentList.dob, { emitEvent: false });
              this.primaryMemberForm.updateValueAndValidity({ emitEvent: false });
            }
          }
        });
      } else {
        this.isDependentList = false;
      }
    }
  }

  dateInputEvent(event) {
    const moment = require('moment');
    const newDate = new Date(event.value);
    this.primaryMemberForm.get('dob').setValue(moment(newDate).format('YYYY-MM-DD'));
    this.ageCheck();
  }

  ageCheck() {
    const id = this.primaryMemberForm.get('primaryMember').value;
    const timeDiff = Math.abs(
      Date.now() - new Date(this.primaryMemberForm.get('dob').value).getTime(),
    );
    const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    if (
      id == 1 ||
      id == 2 ||
      id == 3 ||
      id == 6 ||
      id == 7 ||
      id == 8 ||
      id == 10 ||
      id == 11 ||
      id == 13 ||
      id == 14 ||
      id == 15
    ) {
      if (age < 18) {
        this.primaryMemberForm.get('dob').markAsPending();
        this.isAgeErro = true;
      } else {
        this.isAgeErro = false;
      }
    } else {
      this.isAgeErro = false;
    }
  }

  addInsurerFunc() {
    const id = +this.primaryMemberForm.get('primaryMember').value;
    this.addedInsurer.relationshipId = this.primaryMemberForm.get('primaryMember').value;
    if (this.customerId) {
      this.addedInsurer.id = this.selectedMember?.id;
    }

    // this.addedInsurer.rating = this.primaryMemberForm.get('smoker').value;
    if (
      this.router.url.indexOf('/quote/personal-accident') > -1 ||
      this.router.url.indexOf('/quote/pa-insurance') > -1
    ) {
      this.addedInsurer.maritalStatus = this.primaryMemberForm.get('maritalStatus').value;
      this.addedInsurer.occupation = this.primaryMemberForm.get('occupation').value;
    } else if (
      this.router.url.indexOf('/quote/health-details') > -1 ||
      this.router.url.indexOf('/quote/health-detail') > -1
    ) {
      this.addedInsurer.rating = this.primaryMemberForm.get('smoker').value;
    }
    // this.addedInsurer.dob.concat(this.primaryMemberForm.get('year').value + '/'
    // + this.primaryMemberForm.get('month').value + '/' + this.primaryMemberForm.get('date').value);

    this.addedInsurer.dob = this.primaryMemberForm.get('dob').value;
    switch (id) {
      case 2:
        this.addedInsurer.gender = 'F';
        this.addedInsurer.relation = 'Wife';
        break;
      case 3:
        this.addedInsurer.gender = 'M';
        this.addedInsurer.relation = 'Husband';
        break;
      case 4:
        this.addedInsurer.gender = 'F';
        this.addedInsurer.relation = 'Daughter';
        break;
      case 5:
        this.addedInsurer.gender = 'M';
        this.addedInsurer.relation = 'Son';
        break;
      case 6:
        this.addedInsurer.gender = 'F';
        this.addedInsurer.relation = 'Sister';
        break;
      case 7:
        this.addedInsurer.gender = 'F';
        this.addedInsurer.relation = 'Mother';
        break;
      case 8:
        this.addedInsurer.gender = 'F';
        this.addedInsurer.relation = 'Mother in Law';
        break;
      case 9:
        this.addedInsurer.gender = 'M';
        this.addedInsurer.relation = 'Grand Son';
        break;
      case 10:
        this.addedInsurer.gender = 'F';
        this.addedInsurer.relation = 'Grand Mother';
        break;
      case 11:
        this.addedInsurer.gender = 'M';
        this.addedInsurer.relation = 'Grand Father';
        break;
      case 12:
        this.addedInsurer.gender = 'F';
        this.addedInsurer.relation = 'Grand Daughter';
        break;
      case 13:
        this.addedInsurer.gender = 'M';
        this.addedInsurer.relation = 'Father in Law';
        break;
      case 14:
        this.addedInsurer.gender = 'M';
        this.addedInsurer.relation = 'Father';
        break;
      case 15:
        this.addedInsurer.gender = 'M';
        this.addedInsurer.relation = 'Brother';
        break;
    }
    if (this.primaryMemberForm.valid) {
      // const result = [this.addedInsurer, this.remainingDependentList];
      this.dialogRef.close(this.addedInsurer);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  disableDob() {
    if (this.primaryMemberForm.get('primaryMember').valid || this.productType === 'FF') {
      return false;
    } else {
      return true;
    }
  }

  disableButton() {
    if (this.primaryMemberForm.valid) {
      return true;
    } else {
      return false;
    }
  }
}
