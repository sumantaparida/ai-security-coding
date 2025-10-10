import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { AlertService } from '@app/_services/alert.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';


import { LoaderService } from '@app/_services/loader.service';
@Component({
  selector: 'app-cif-modal',
  templateUrl: './cif-modal.component.html',
  styleUrls: ['./cif-modal.component.css']
})
export class CifModalComponent implements OnInit {

  errMsg;
  constructor(
    public dialogRef: MatDialogRef<CifModalComponent>,
    // @Inject(MAT_DIALOG_DATA) public toSend: ,
    private router: Router,
    private alertService: AlertService,
    private customersService: CustomersService,
    public dialog: MatDialog,
    private loaderService: LoaderService
    // @Inject(MAT_DIALOG_DATA) public data: ,
  ) { }

  showInput = false;
  showButtons = false;
  cif: FormGroup;

  ngOnInit(): void {
    // this.dialogRef.disableClose = true;
  }

  addCustomer(check) {
    if (check === 'close') {
      this.dialogRef.close('close');
    }
  }

  callInput() {
    this.showButtons = false;
    this.showInput = true;
    this.cif = new FormGroup({
      cifNumber: new FormControl(null, Validators.required)
    });
  }

  callButtons() {
    this.showInput = false;
    this.showButtons = true;
  }

  goToIndividual() {
    this.addCustomer('close');
    this.router.navigate(['/mycustomers/addindividualcustomer']);
  }

  goToBusiness() {
    this.addCustomer('close');
    this.router.navigate(['/mycustomers/addbusinesscustomer']);
  }

  disableSubmit() {
    if (this.cif.get('cifNumber').valid) {
      return true;
    }
    return false;
  }

  checkCIFNumber() {
    this.loaderService.showSpinner(true);
    const cif = this.cif.get('cifNumber').value;
    this.customersService.getCustomerfromBank(cif).subscribe(result => {
      this.loaderService.showSpinner(false);
      this.addCustomer('close');
      console.log('result', result);
      if (result['isIndividual']) {
        this.router.navigate(['/mycustomers/addindividualcustomer'], { queryParams: { cif } });
      } else {
        this.router.navigate(['/mycustomers/addbusinesscustomer'], { queryParams: { cif } });
      }
    }, error => {

      this.loaderService.showSpinner(false);
      if (error.error.details) {
        this.errMsg = error.error.details;
      } else {
        this.errMsg = 'Connection Timeout'

      }

      // console.log(error.error.details);
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: this.errMsg,
        panelClass: 'dialog-width'
      });
      dialogRef.afterClosed().subscribe(data => {
        // navigate
      });
    });
  }
}
