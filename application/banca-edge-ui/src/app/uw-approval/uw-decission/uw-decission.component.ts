import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UwService } from './services/uw.service';
import { MatDialog } from '@angular/material/dialog';
import { UwAddNoteModelComponent } from '../components/uw-add-note-model/uw-add-note-model.component';
import { LoaderService } from '@app/_services/loader.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { MedicalRequirementComponent } from '../components/medical-requirement/medical-requirement.component';

@Component({
  selector: 'app-uw-decission',
  templateUrl: './uw-decission.component.html',
  styleUrls: ['./uw-decission.component.css'],
})
export class UwDecissionComponent implements OnInit {
  customerName: string;

  productName: string;

  appNo: string;

  uwDecisionMaster;

  applicationNotes;

  applicationDetails;

  addedMedicalTestArr = [];

  showMedicalDetails = false;

  uwDecisionForm = this.fb.group({
    uwDecision: ['', Validators.required],
    comment: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private uwService: UwService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.uwService.getUwDecission().subscribe((data) => {
      this.uwDecisionMaster = data;
      // this.uwDecisionMaster = this.uwDecisionMaster.filter((arr) => {
      //   return arr.id != 4;
      // });
    });
    this.route.params.subscribe((params) => {
      if (params.customerName) {
        this.customerName = params.customerName;
      }
      if (params.productName) {
        this.productName = params.productName;
      }
      if (params.appNo) {
        this.appNo = params.appNo;
      }
    });

    this.loaderService.showSpinner(true);
    this.uwService.getApplicationDetails(this.appNo).subscribe(
      (value) => {
        this.loaderService.showSpinner(false);
        this.applicationDetails = value;
      },
      () => {
        this.loaderService.showSpinner(false);
      },
    );

    this.getNotes();

    this.uwDecisionForm.get('uwDecision').valueChanges.subscribe((changes) => {
      if (changes === '3') {
        this.uwDecisionForm.addControl(
          'additionalPremium',
          new FormControl('', Validators.required),
        );
      } else {
        this.uwDecisionForm.removeControl('additionalPremium');
      }
    });
  }

  getNotes() {
    this.loaderService.showSpinner(true);
    this.uwService.getNotes(this.appNo).subscribe(
      (values) => {
        this.loaderService.showSpinner(false);
        this.applicationNotes = values;
      },
      () => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  saveDecission() {
    const reqBody = {
      appNo: this.appNo,
      decisionCode: this.uwDecisionForm.get('uwDecision').value,
      extraPremium:
        this.uwDecisionForm.get('uwDecision').value === '3'
          ? this.uwDecisionForm.get('additionalPremium').value
          : 0,
      comment: this.uwDecisionForm.get('comment').value,
    };
    this.loaderService.showSpinner(true);
    this.uwService.saveDecision(reqBody).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        let message = '';
        if (data['statusCode'] === 6) {
          message = 'Rejection email has been sent to customer';
        } else {
          if (this.uwDecisionForm.get('uwDecision').value === '1') {
            message = 'Under writing details saved succesfully.';
          } else if (this.uwDecisionForm.get('uwDecision').value === '3') {
            message = 'Counter offer has been sent to customer';
          } else if (this.uwDecisionForm.get('uwDecision').value === '4') {
            message = 'Medical requirement details saved succesfully.';
          }
        }
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['group-credit', 'under-writing']);
          // navigate
        });
      },
      () => {
        this.loaderService.showSpinner(false);
        const message =
          'Sorry! there was an error processing your request, Please try after sometime.';
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe(() => {
          // navigate
        });
      },
    );
  }

  openDailog() {
    const dialogRef = this.dialog.open(UwAddNoteModelComponent, {
      height: '300px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== '') {
        const reqBody = {
          appNo: this.appNo,
          comment: result,
        };
        this.loaderService.showSpinner(true);
        this.uwService.addNotes(reqBody).subscribe(
          () => {
            this.loaderService.showSpinner(false);
            this.getNotes();
          },
          () => {
            this.loaderService.showSpinner(false);
          },
        );
      }
    });
  }

  addMedicalTest() {
    const dialogRef = this.dialog.open(MedicalRequirementComponent, {
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((addedTest) => {
      console.log('added', addedTest);
      if (addedTest !== undefined) {
        this.addedMedicalTestArr.push(addedTest);
        this.showMedicalDetails = true;
      }
    });
  }
}
