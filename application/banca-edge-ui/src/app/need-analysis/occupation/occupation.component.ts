import { Component, OnInit, HostBinding, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.css'],
  animations: [
    trigger('occupationShowHide', [
      state('occupation', style({
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('riskType', style({
        display: 'none',
        opacity: 0,
        marginTop: '-150px'
      })),
      state('*', style({
        marginTop: '150px',
        display: 'none',
        opacity: 0
      })),
      transition('occupation <=> *', [
        animate('1s')
      ])
    ])
  ]
})

export class OccupationComponent implements OnInit, OnChanges {

  @Input() state;
  @Input() form;
  image1;
  image2;
  image3;
  image4;
  image5;
  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
  }
  ngOnChanges() {
    this.imageToDisplay();

  }

  onOccupationSelected(occupationType) {
    if (occupationType === 'employee') {
      this.form.get('occupationValue').setValue(1);
      this.userDataService.setDisplayInfo('occupation', 'Employee');
    } else if (occupationType === 'employer') {
      this.form.get('occupationValue').setValue(2);
      this.userDataService.setDisplayInfo('occupation', 'Employer');
    } else if (occupationType === 'proprietor') {
      this.form.get('occupationValue').setValue(3);
      this.userDataService.setDisplayInfo('occupation', 'Proprietor');
    } else if (occupationType === 'consultant') {
      this.form.get('occupationValue').setValue(4);
      this.userDataService.setDisplayInfo('occupation', 'Consultant');
    } else if (occupationType === 'professional') {
      this.form.get('occupationValue').setValue(5);
      this.userDataService.setDisplayInfo('occupation', 'Professional');
    }
    this.userDataService.setUserInfo('occupation', this.form.get('occupationValue').value);
  }

  imageToDisplay() {
    if (this.form.get('genderValue').value === 'M') {
      this.image1 = 'Man - Employee';
      this.image2 = 'Man - Employer';
      this.image3 = 'Man - Proprietor';
      this.image4 = 'Man - consultant';
      this.image5 = 'Man - Professional';
    } else {
      this.image1 = 'Lady 1 - Employee';
      this.image2 = 'Lady 1 - Employer';
      this.image3 = 'Lady 1 - Propreitor';
      this.image4 = 'Lady 1 - Consultant';
      this.image5 = 'Lady 1 - Professional';
    }
  }
}
