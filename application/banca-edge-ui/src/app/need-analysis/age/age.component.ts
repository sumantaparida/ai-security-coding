import { Component, OnInit, HostBinding, Input, } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

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
  selector: 'app-age',
  templateUrl: './age.component.html',
  styleUrls: ['./age.component.css'],
  animations: [
    trigger('ageShowHide', [
      state('age', style({
        // display: 'block',
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('maritalStatus', style({
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
      transition('age <=> *', [
        animate('1s')
      ])
    ])
  ]
})

export class AgeComponent implements OnInit {


  @Input() state;
  @Input() form: FormGroup;
  value = 0;

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
  }

  onKeyUp(event) {
    this.userDataService.setUserInfo('age', +event.value);
    this.userDataService.setDisplayInfo('age', +event.value);

  }

  formatLabel(value: number) {
    if (value >= 1) {
      return Math.round(value / 1);
    }

    return value;
  }
}
