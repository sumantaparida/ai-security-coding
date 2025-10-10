import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ComplaintDataService } from '../complaint-data.service';

interface ComplaintNature {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-complaint-nature',
  templateUrl: './complaint-nature.component.html',
  styleUrls: ['./complaint-nature.component.css'],
  animations: [
    trigger('complainNatureShowHide', [
      state('complaintNature', style({
        // display: 'block',
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('uploadDocument', style({
        // display: 'none',
        display: 'none',
        opacity: 0,
        marginTop: '-150px'

      })),
      state('*', style({
        marginTop: '150px',
        display: 'none',
        opacity: 0,

      })),
      transition('complaintNature <=> *', [
        animate('1s')
      ])
    ])
  ]
})
export class ComplaintNatureComponent implements OnInit {

  @Input() state;
  @Input() form: FormGroup;

  otherComplaint = false;
  claimComplaint = false;

  // complaintNatureOptions: string[] = ['Claim', 'Others'];
  complaintNatureOptions: ComplaintNature[] = [
    { value: 'Claim', viewValue: 'Claim' },
    { value: 'Others', viewValue: 'Others' },
  ];

  constructor(private complaintData: ComplaintDataService) { }



  ngOnInit() {

  }

  changeOption(e) {
    this.form.get('complaintNature').setValue(e.value);
    this.complaintData.setComplaintInfo('complaintNature', this.form.get('complaintNature').value);
    console.log('nature', this.form.get('complaintNature').value);
    console.log('form', this.form);

    const opt = this.form.get('complaintNature').value;
    console.log('opybef', opt);
    if (opt === 'Others') {
      console.log('opy', opt);
      this.form.addControl('otherComplaintNature', new FormControl('', [Validators.required,
        Validators.minLength(5), Validators.maxLength(1500)]));
      this.otherComplaint = true;
      console.log('form new', this.form.get('otherComplaintNature').value);
      this.claimComplaint = false;
      this.form.removeControl('claimDescriptive');
      this.form.removeControl('claimNumber');

    } else if (opt === 'Claim') {
      this.form.addControl('claimNumber', new FormControl('', [Validators.required]));
      this.form.addControl('claimDescriptive', new FormControl('', [Validators.required,
         Validators.minLength(5), Validators.maxLength(1500)]));

      this.claimComplaint = true;
      this.otherComplaint = false;
      this.form.removeControl('otherComplaintNature');
    }
    // else {
    //   this.otherComplaint = false;
    //   this.form.removeControl('otherComplaintNature');
    // }
  }

}
