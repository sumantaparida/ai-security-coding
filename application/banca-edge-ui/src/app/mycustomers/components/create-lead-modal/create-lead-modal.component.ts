import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-create-lead-modal',
  templateUrl: './create-lead-modal.component.html',
  styleUrls: ['./create-lead-modal.component.css'],
})
export class CreateLeadModalComponent implements OnInit {
  lobType;

  journeyType;

  leadGroup: FormGroup;

  user;

  isLicenseTypeGeneral;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<CreateLeadModalComponent>,
    private router: Router,
    private accountService: AccountService,
  ) {
    this.accountService.user.subscribe((x) => {
      this.user = x;
      this.isLicenseTypeGeneral =
        this.user?.licenseType?.toLowerCase() === 'general' ? true : false;
    });
  }

  ngOnInit(): void {
    this.leadGroup = new FormGroup({
      lobType: new FormControl('', Validators.required),
      journeyType: new FormControl('', Validators.required),
    });
    // this.data.customerMbNo = '000000000'
    console.log('data==', this.data);
    if (!this.data.customerMbNo) {
      console.log('insinde==', this.data);

      this.leadGroup.get('journeyType').setValue('1');
      this.leadGroup.get('journeyType').disable();
      this.leadGroup.updateValueAndValidity();
    }
  }

  onSearchFieldChange(val) {}

  onSubmit() {
    this.lobType = this.leadGroup.get('lobType').value;
    this.journeyType = this.leadGroup.getRawValue().journeyType;
    this.leadJourney(parseInt(this.leadGroup.getRawValue().journeyType));
  }

  //   // console.log('journey', journey, val,this.data?.oneMinPlan);
  //   // if (this.data?.oneMinPlan === false) {
  //   //   if (val === 1) {
  //   //     this.router.navigate([`/lms/new-application/${this.data?.customerId}/${journey}/${lobType}`]);
  //   //   } else if (this.data.planCompleted && val === 2) {
  //   //     this.router.navigate([`/lms/new-application/${this.data?.customerId}/${journey}/${lobType}`]);
  //   //   } else {
  //   //     this.router.navigate(['/needanalysis/home', this.data?.customerId]);
  //   //   }
  //   //   this.dialogRef.close();
  //   // } else if (this.data?.oneMinPlan === true) {
  //   //   console.log('value=====', val);
  //   //   this.dialogRef.close(val);
  //   // }
  // }

  leadJourney(val) {
    const journey = val === 1 ? 'physical' : 'digital';
    let lobType = this.leadGroup.get('lobType').value;
    // console.log('journey', journey, val,this.data?.oneMinPlan);
    //
    if (this.data?.oneMinPlan === false) {
      //

      if (val === 1) {
        this.router.navigate([
          `/lms/new-application/${this.data?.customerId}/${journey}/${lobType}`,
        ]);
      } else if (val === 2) {
        // console.log('checking',this.data.planCompleted,lobType)
        if ((this.data.planCompleted && lobType === 'Life') || lobType === 'nonLife') {
          this.router.navigate([
            `/lms/new-application/${this.data?.customerId}/${journey}/${lobType}`,
          ]);
        } else {
          // console.log('hi1323',this.data)
          this.router.navigate(['/needanalysis/home', this.data?.customerId, lobType]);
        }
      }
      this.dialogRef.close();
    } else if (this.data?.oneMinPlan === true) {
      console.log('value=====', val);
      this.dialogRef.close({ val, lobType });
    }
  }
}
