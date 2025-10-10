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

interface ComplaintMode {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-complaint-mode',
  templateUrl: './complaint-mode.component.html',
  styleUrls: ['./complaint-mode.component.css'],
  animations: [
    trigger('complaintModeShowHide', [
      state('complaintMode', style({
        // display: 'block',
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('complaintNature', style({
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
      transition('complaintMode <=> *', [
        animate('1s')
      ])
    ])
  ]
})
export class ComplaintModeComponent implements OnInit {

  @Input() state;
  @Input() form: FormGroup;
  otherComplaint = false;

  // complaintModeOptions: string[] = ['Oral', 'Letter', 'Electronic', 'Others'];
  complaintModeOptions: ComplaintMode[] = [
    { value: 'Oral', viewValue: 'Oral' },
    { value: 'Letter', viewValue: 'Letter' },
    { value: 'Electronic', viewValue: 'Electronic' },
    { value: 'Others', viewValue: 'Others' }
  ];

  constructor(private complaintData: ComplaintDataService) { }

  ngOnInit() {
  }
  changeOption(e) {
    this.form.get('complaintMode').setValue(e.value);
    this.complaintData.setComplaintInfo('complaintMode', this.form.get('complaintMode').value);
    console.log('against', this.form.get('complaintMode').value);
    console.log('form', this.form);

    const opt = this.form.get('complaintMode').value;
    console.log('opybef', opt);
    if (opt === 'Others') {
      console.log('opy', opt);
      this.form.addControl('otherComplaintMode', new FormControl('', [Validators.required,
      Validators.minLength(5), Validators.maxLength(1500)]));
      this.otherComplaint = true;
      console.log('form new', this.form.get('otherComplaintMode').value);
    } else {
      this.otherComplaint = false;
      this.form.removeControl('otherComplaintMode');
    }

  }

}
