import { Component, OnInit, HostBinding, Input } from '@angular/core';
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
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.css'],
  animations: [
    trigger('showHide', [
      state('gender', style({
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('age', style({
        display: 'none',
        opacity: 0,
        marginTop: '-300px'
      })),
      state('*', style({
        display: 'none',
        opacity: 0,
        marginTop: '-300px'
      })),
      transition('gender <=> *', [
        animate('1s')
      ])
    ])
  ]
})
export class GenderComponent implements OnInit {

  @Input() state;
  @Input() form: FormGroup;
  personAgeGroup;
  imageName;


  constructor(private userDataService: UserDataService ) { }

  ngOnInit() {
  }
  onGenderSelected(gender) {
    if (gender === 'male') {
      this.form.get('genderValue').setValue('M');
      this.userDataService.setUserInfo('gender', 'M');
      this.userDataService.setDisplayInfo('gender', 'Male');
    } else {
      this.form.get('genderValue').setValue('F');
      this.userDataService.setUserInfo('gender', 'F');
      this.userDataService.setDisplayInfo('gender', 'Female');

      // this.displayDataService.setUserInfo('gender','Female');
    }


  }

  onAgeGroupSelected(ageGroup) {
    if (this.form.get('genderValue').value === 'M') {
      if (ageGroup === 'young') {
        this.personAgeGroup = ageGroup;
        this.userDataService.setUserInfo('ageGroup', 'young');

      } else if (ageGroup === 'elder') {
        this.personAgeGroup = ageGroup;
        this.userDataService.setUserInfo('ageGroup', 'elder');

      } else if (ageGroup === 'senior') {
        this.personAgeGroup = ageGroup;
        this.userDataService.setUserInfo('ageGroup', 'senior');

      }

    } else if (this.form.get('genderValue').value === 'F') {
      if (ageGroup === 'young') {
        this.personAgeGroup = ageGroup;
        this.userDataService.setUserInfo('ageGroup', 'young');

      } else if (ageGroup === 'elder') {
        this.personAgeGroup = ageGroup;
        this.userDataService.setUserInfo('ageGroup', 'elder');

      } else if (ageGroup === 'senior') {
        this.personAgeGroup = ageGroup;
        this.userDataService.setUserInfo('ageGroup', 'senior');

      }
    }
  }

}
