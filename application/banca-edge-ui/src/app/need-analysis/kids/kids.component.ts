import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.css'],
  animations: [
    trigger('kidsShowHide', [
      state(
        'kids',
        style({
          // display: 'block',
          display: 'block',
          opacity: 1,
          marginTop: '0px',
        }),
      ),
      // state('maritalStatus', style({
      //   // display: 'none',
      //   display: 'none',
      //   opacity:0,
      //   marginTop: '-150px'

      // })),
      state(
        'occupation',
        style({
          // display: 'none',
          display: 'none',
          opacity: 0,
          marginTop: '-150px',
        }),
      ),
      state(
        '*',
        style({
          marginTop: '150px',
          display: 'none',
          opacity: 0,
        }),
      ),
      transition('kids <=> *', [animate('1s')]),
    ]),
  ],
})
export class KidsComponent implements OnInit {
  @Input() state;

  @Input() form: FormGroup;

  numberOfKids: number;

  regexNum = '^[0-9]{1,2}$';

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {}

  numOfKids() {
    this.userDataService.setUserInfo('kids', +this.form.get('kidsNumValue').value);
    this.userDataService.setDisplayInfo('kids', +this.form.get('kidsNumValue').value);

    this.numberOfKids = Number(this.form.get('kidsNumValue').value);
    if (this.form.get('kidsNumValue').value == 0) {
      this.userDataService.setUserInfo('kidsNumValue', +this.form.get('kidsNumValue').value);
      this.userDataService.setDisplayInfo('kidsNumValue', +this.form.get('kidsNumValue').value);
    } else if (this.form.get('kidsNumValue').value == 1) {
      this.form.addControl(
        'firstKidAge',
        new FormControl('', [
          Validators.required,
          Validators.pattern(this.regexNum),
          // Validators.max(25),
        ]),
      );
      this.form.removeControl('secondKidAge');
      this.form.removeControl('thirdKidAge');
      this.form.removeControl('fourthKidAge');

      console.log('form=', this.form);
      this.userDataService.setUserInfo('firstKidAge', this.form.get('firstKidAge').value);
      this.userDataService.setDisplayInfo('firstKidAge', this.form.get('firstKidAge').value);
    } else if (this.form.get('kidsNumValue').value == 2) {
      this.form.addControl(
        'secondKidAge',
        new FormControl('', [
          Validators.required,
          Validators.pattern(this.regexNum),
          // Validators.max(25),
        ]),
      );
      this.form.addControl(
        'firstKidAge',
        new FormControl('', [
          Validators.required,
          Validators.pattern(this.regexNum),
          // Validators.max(25),
        ]),
      );
      console.log('form=', this.form);
      this.form.removeControl('thirdKidAge');
      this.form.removeControl('fourthKidAge');

      this.userDataService.setUserInfo('firstKidAge', +this.form.get('firstKidAge').value);
      this.userDataService.setUserInfo('secondKidAge', +this.form.get('secondKidAge').value);
      this.userDataService.setDisplayInfo('firstKidAge', +this.form.get('firstKidAge').value);
      this.userDataService.setDisplayInfo('secondKidAge', +this.form.get('secondKidAge').value);
    } else if (this.form.get('kidsNumValue').value == 3) {
      this.form.addControl(
        'thirdKidAge',
        new FormControl('', [
          Validators.required,
          Validators.pattern(this.regexNum),
          // Validators.max(25),
        ]),
      );
      this.form.addControl(
        'secondKidAge',
        new FormControl('', [
          Validators.required,
          Validators.pattern(this.regexNum),
          // Validators.max(25),
        ]),
      );
      this.form.addControl(
        'firstKidAge',
        new FormControl('', [
          Validators.required,
          Validators.pattern(this.regexNum),
          // Validators.max(25),
        ]),
      );
      this.form.removeControl('fourthKidAge');

      console.log('form=', this.form);

      this.userDataService.setUserInfo('firstKidAge', +this.form.get('firstKidAge').value);
      this.userDataService.setUserInfo('secondKidAge', +this.form.get('secondKidAge').value);
      this.userDataService.setUserInfo('thirdKidAge', +this.form.get('thirdKidAge').value);
      this.userDataService.setDisplayInfo('firstKidAge', +this.form.get('firstKidAge').value);
      this.userDataService.setDisplayInfo('secondKidAge', +this.form.get('secondKidAge').value);
      this.userDataService.setDisplayInfo('thirdKidAge', +this.form.get('thirdKidAge').value);
    } else if (this.form.get('kidsNumValue').value == 4) {
      this.form.addControl(
        'fourthKidAge',
        new FormControl('', [
          Validators.required,
          Validators.pattern(this.regexNum),
          // Validators.max(25),
        ]),
      );
      this.form.addControl(
        'thirdKidAge',
        new FormControl('', [
          Validators.required,
          Validators.pattern(this.regexNum),
          // Validators.max(25),
        ]),
      );
      this.form.addControl(
        'secondKidAge',
        new FormControl('', [
          Validators.required,
          Validators.pattern(this.regexNum),
          // Validators.max(25),
        ]),
      );
      this.form.addControl(
        'firstKidAge',
        new FormControl('', [
          Validators.required,
          Validators.pattern(this.regexNum),
          // Validators.max(25),
        ]),
      );

      console.log('form=', this.form);

      this.userDataService.setUserInfo('firstKidAge', +this.form.get('firstKidAge').value);
      this.userDataService.setUserInfo('secondKidAge', +this.form.get('secondKidAge').value);
      this.userDataService.setUserInfo('thirdKidAge', +this.form.get('thirdKidAge').value);
      this.userDataService.setUserInfo('fourthKidAge', +this.form.get('fourthKidAge').value);
      this.userDataService.setDisplayInfo('firstKidAge', +this.form.get('firstKidAge').value);
      this.userDataService.setDisplayInfo('secondKidAge', +this.form.get('secondKidAge').value);
      this.userDataService.setDisplayInfo('thirdKidAge', +this.form.get('thirdKidAge').value);
      this.userDataService.setDisplayInfo('fourthKidAge', +this.form.get('fourthKidAge').value);
    }
  }
}
