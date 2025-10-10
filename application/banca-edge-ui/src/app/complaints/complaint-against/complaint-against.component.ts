import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ComplaintDataService } from '../complaint-data.service';
interface ComplaintAgainst {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-complaint-against',
  templateUrl: './complaint-against.component.html',
  styleUrls: ['./complaint-against.component.css'],
  animations: [
    trigger('complaintAgainstShowHide', [
      state('complaintAgainst', style({
        // display: 'block',
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('complaintMode', style({
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
      transition('complaintAgainst <=> *', [
        animate('1s')
      ])
    ])
  ]

})
export class ComplaintAgainstComponent implements OnInit {

  @Input() state;
  @Input() form: FormGroup;
  otherComplaint = false;
  selectedValue: string;

  // complaintAgainstOptions: string[] = ['Corporate Agent', 'Insurer', 'Others'];
  complaintAgainstOptions: ComplaintAgainst[] = [
    { value: 'Corporate Agent', viewValue: 'Corporate Agent' },
    { value: 'Insurer', viewValue: 'Insurer' },
    { value: 'Others', viewValue: 'Others' }
  ];
  // complaintAgainst = new FormControl('', [
  //   Validators.required
  // ]);
  constructor(private complaintData: ComplaintDataService) { }

  ngOnInit() {
    // this.form.get('complaintAgainst').setValue('Corporate Agent');
  }

  changeOption(e) {
    console.log(e, 'value e');
    this.form.get('complaintAgainst').setValue(e.value);

    this.complaintData.setComplaintInfo('complaintAgainst', this.form.get('complaintAgainst').value);
    console.log('against', this.form.get('complaintAgainst').value);
    console.log('form', this.form);

    const opt = this.form.get('complaintAgainst').value;
    console.log('opybef', opt);
    if (opt === 'Others') {
      console.log('opy', opt);
      this.form.addControl('otherComplaintAgainst', new FormControl('', [Validators.required,
         Validators.minLength(5), Validators.maxLength(1500)]));
      this.otherComplaint = true;
      console.log('form new', this.form.get('otherComplaintAgainst').value);
    } else {
      this.otherComplaint = false;
      this.form.removeControl('otherComplaintAgainst');
    }

  }
}
