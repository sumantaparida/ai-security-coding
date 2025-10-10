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
  selector: 'app-house-type',
  templateUrl: './house-type.component.html',
  styleUrls: ['./house-type.component.css'],
  animations: [
    trigger('houseTypeShowHide', [
      state('houseType', style({
        display: 'block',
        opacity: 1,
        marginTop: '0px'
      })),
      state('valuables', style({
        display: 'none',
        opacity: 0,
        marginTop: '-150px'
      })),
      state('*', style({
        marginTop: '150px',
        display: 'none',
        opacity: 0,
      })),
      transition('houseType <=> *', [
        animate('1s')
      ])
    ])
  ]
})

export class HouseTypeComponent implements OnInit, OnChanges {

  @Input() state;
  @Input() form;
  youngMan = true;
  gender;
  ageGroup;
  image1;
  image2;
  image3;
  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    // this.ageGroup = this.userDataService.getUserInfo().ageGroup;
    // this.gender = this.userDataService.getUserInfo().gender;
    // this.imageToDisplay();
  }

  ngOnChanges() {
    // this.ageGroup = this.userDataService.getUserInfo().ageGroup;
    // this.imageToDisplay();

  }

  onHousTypeSelected(houseType) {
    if (houseType === 'ownHouse') {
      this.form.get('houseTypeValue').setValue(1);
      this.userDataService.setUserInfo('houseType', 1);
      this.userDataService.setDisplayInfo('houseType', 'Own House');

      // this.displayDataService.setUserInfo('houseType', 'Own House');

    } else if (houseType === 'rentedHouse') {
      this.form.get('houseTypeValue').setValue(2);
      this.userDataService.setUserInfo('houseType', 2);
      this.userDataService.setDisplayInfo('houseType', 'Rented House');

    } else if (houseType === 'withParents') {
      this.form.get('houseTypeValue').setValue(3);
      this.userDataService.setUserInfo('houseType', 3);
      this.userDataService.setDisplayInfo('houseType', 'With Parents');
    }

  }


  // imageToDisplay() {
  //   if (this.form.get('genderValue').value === 'M') {
  //     if (this.ageGroup === 'young') {
  //       this.image1 = 'Man 1 - Own house';
  //       this.image2 = 'Man 1 - rent';
  //       this.image3 = 'Man 1 - with parents';

  //     } else if (this.ageGroup === 'elder') {
  //       this.image1 = 'Man 2 - Own';
  //       this.image2 = 'Man 2 - Rent';
  //       this.image3 = 'Man 2 - with parents';
  //     } else if (this.ageGroup === 'senior') {
  //       this.image1 = 'Man 3 - Own';
  //       this.image2 = 'Man 3 - rent';
  //       this.image3 = 'Man 3 - with parents';
  //     }
  //   } else if (this.form.get('genderValue').value === 'F') {
  //     if (this.ageGroup === 'young') {
  //       this.image1 = 'Lady 1 - own';
  //       this.image2 = 'Lady 1 - Rent';
  //       this.image3 = 'Lady 1 - with parents';

  //     } else if (this.ageGroup === 'elder') {
  //       this.image1 = 'Lady 2 - own';
  //       this.image2 = 'Lady 2 - Rent';
  //       this.image3 = 'Lady 2 - with parents';
  //     } else if (this.ageGroup === 'senior') {
  //       this.image1 = 'Lady 3 - Own';
  //       this.image2 = 'Lady 3 - Rent';
  //       this.image3 = 'Lady 3 - with parents';
  //     }
  //   }
  // }
}
