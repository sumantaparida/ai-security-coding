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
  selector: 'app-social-life',
  templateUrl: './social-life.component.html',
  styleUrls: ['./social-life.component.css'],
  animations: [
    trigger('socialLifeShowHide', [
      state('socialLife', style({
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
        opacity: 0,
        display: 'none'
      })),
      transition('socialLife <=> *', [
        animate('1s')
      ])
    ])
  ]
})
export class SocialLifeComponent implements OnInit {

  @Input() state;
  @Input() form: FormGroup;

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
  }

  onSocialLifeSelected(status) {
    if (status === 'yes') {
      this.form.get('socialLifeValue').setValue('Y');
      this.userDataService.setUserInfo('socialLife', 'Y');
      this.userDataService.setDisplayInfo('socialLife', 'Maximum');

    } else {
      this.form.get('socialLifeValue').setValue('N');
      this.userDataService.setUserInfo('socialLife', 'N');
      this.userDataService.setDisplayInfo('socialLife', 'Minimum');
    }
  }

}
