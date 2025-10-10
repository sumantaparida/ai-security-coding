import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '@app/_services/loader.service';
import { QuoteService } from '../quote.service'
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD MMMM YYYY',
  },
  display: {
    dateInput: 'DD MMMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-mintopro-ckyc-modal',
  templateUrl: './mintopro-ckyc-modal.component.html',
  styleUrls: ['./mintopro-ckyc-modal.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MintoproCkycModalComponent implements OnInit {
  screen = 'kyc';
  resDetails;
  maxDate=new Date(Date.now());
  // response = {message:'asdasdasbdkasdkashdkjashdakdjashdjhaskjdakhk'}
  kycForm : FormGroup;
  constructor(
    private dialogRef: MatDialogRef<MintoproCkycModalComponent>,
    private loaderService: LoaderService,
    private quoteService: QuoteService,
    @Inject(MAT_DIALOG_DATA) public data, 
  ) {}

  ngOnInit(): void {
    this.kycForm = new FormGroup({
      customerType: new FormControl('',Validators.required),
      dob: new FormControl(this.data.dob,Validators.required),
      idNum: new FormControl('',[Validators.required,Validators.pattern('^[A-Z]{3}[ABCFGHLJPTK][A-Z][0-9]{4}[A-Z]$')]),
    })
  }
  onSubmit(){
    console.log('formgroup',this.kycForm)
    const reqBody=
    {
      reqId:this.data.quoteId,
      customerType:this.kycForm.get('customerType').value,
       idType:"PAN",
       idNum:this.kycForm.get('idNum').value,
       dob:moment(this.kycForm.get('dob').value).format('YYYY-MM-DD'),
       customerId:this.data.customerId.toString(),
       insurerId:this.data.insurerId,
       coverType:'INDIVIDUAL',
       pinCode:this.data.pinCode
    }

    this.loaderService.showSpinner(true);
    this.quoteService.getCkyc(reqBody).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        console.log('yo',res['returnCode'],res['customerKycDetails'])
       if(res['returnCode'] === 0 && res['customerKycDetails'].length > 0){
        this.resDetails = res;
        this.screen = 'success';
       } else if(res['returnCode'] === 1 || res['customerKycDetails'].length == 0) {
        this.resDetails = res['returnMessage']
        this.screen = 'failure'
       }
      },
      (err) => {
        console.log('error', err);
        this.loaderService.showSpinner(false);
        this.resDetails = err['returnMessage'] ? err['returnMessage'] : 'KYC details fetch has failed. Please retry after some time.'
        this.screen = 'failure'
      },
    );

  }

  onConfirm(){
    this.resDetails.panNo = this.kycForm.get('idNum').value
    this.dialogRef.close(this.resDetails);
  }

  onReturn(){
  this.dialogRef.close();
  }
}
