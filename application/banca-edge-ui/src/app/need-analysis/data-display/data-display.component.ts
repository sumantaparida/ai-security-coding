import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.css'],
})
export class DataDisplayComponent implements OnInit, OnChanges {
  userInfo;
  displayInfo;
  // @Input() state;
  @Input() form;

  @Input() isCustomer;
  roundValue;
  showGender;
  showOccupation;
  showOnlinPresence;
  showRisk;
  showHouse;
  showPossession;
  customerId;

  constructor(
    public userDataService: UserDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.displayInfo = this.userDataService.getDisplayInfo();
    this.route.params.subscribe((params) => {
      if (params.customerId) {
        this.customerId = params.customerId;

        // this.isCustomer = true;
        // this.userData.setCustomerId(this.customerId);
      }
    });
    console.log('rrrr', this.form);
  }

  ngOnChanges() {
    // this.userInfo = this.userDataService.getDisplayInfo();
    this.userInfo = this.form;
    console.log('usrform', this.userInfo);
    if (this.userInfo.value.riskTypeValue == 1) {
      this.showRisk = 'Minimal';
    } else if (this.userInfo.value.riskTypeValue == 2) {
      this.showRisk = 'Moderate';
    } else if (this.userInfo.value.riskTypeValue == 3) {
      this.showRisk = 'Significant';
    } else if (this.userInfo.value.riskTypeValue == 4) {
      this.showRisk = 'Risk Averse';
    } else if (this.userInfo.value.riskTypeValue == 5) {
      this.showRisk = 'Conservative';
    } else if (this.userInfo.value.riskTypeValue == 6) {
      this.showRisk = 'Moderately Conservative';
    } else if (this.userInfo.value.riskTypeValue == 7) {
      this.showRisk = 'Moderately Aggressive';
    } else if (this.userInfo.value.riskTypeValue == 8) {
      this.showRisk = 'Aggressive';
    }
  }

  setDisplayValues() {
    if (this.userInfo.gender != null) {
      if (this.userInfo.gender == 'M') {
        this.showGender = 'Male';
      } else if (this.userInfo.gender === 'F') {
        this.showGender = 'Female';
      }
    } else if (this.userInfo.occupation) {
      if (this.userInfo.occupation == 1) {
        this.showOccupation = 'Employee';
      } else if (this.userInfo.occuaption == 2) {
        this.showOccupation = 'Employer';
      } else if (this.userInfo.occuaption == 3) {
        this.showOccupation = 'Proprietor';
      } else if (this.userInfo.occuaption == 4) {
        this.showOccupation = 'Consultant';
      } else if (this.userInfo.occuaption == 5) {
        this.showOccupation = 'Professional';
      }
    } else if (this.userInfo.socialLife) {
      if (this.userInfo.socialLife === 'Y') {
        this.showOnlinPresence = 'Maximum';
      } else if (this.userInfo.socialLife === 'Y') {
        this.showOnlinPresence = 'Minimum';
      }
    } else if (this.userInfo.riskType) {
      if (this.userInfo.riskType == 1) {
        this.showRisk = 'Minimal';
      } else if (this.userInfo.riskType == 2) {
        this.showRisk = 'Moderate';
      } else if (this.userInfo.riskType == 3) {
        this.showRisk = 'Significant';
      } else if (this.userInfo.riskType == 4) {
        this.showRisk = 'Risk Averse';
      } else if (this.userInfo.riskType == 5) {
        this.showRisk = 'Conservative';
      } else if (this.userInfo.riskType == 6) {
        this.showRisk = 'Moderately Conservative';
      } else if (this.userInfo.riskType == 7) {
        this.showRisk = 'Moderately Aggressive';
      } else if (this.userInfo.riskType == 8) {
        this.showRisk = 'Aggressive';
      }
    } else if (this.userInfo.houseType) {
      if (this.userInfo.houseType == 1) {
        this.userInfo.showHouse = 'Own House';
      } else if (this.userInfo.houseType == 2) {
        this.userInfo.showHouse = 'On Rent';
      } else if (this.userInfo.houseType == 3) {
        this.userInfo.showHouse = 'With Parents';
      }
    }
  }

  formatLabel(value: number) {
    if (value >= 10000 && value <= 99999) {
      return (this.userInfo.annualIncome = Math.round(value / 1000));
    } else if (value >= 100000 && value <= 9999999) {
      return Math.round(value / 100000);
    } else if (value >= 10000000) {
      return Math.round(value / 10000000);
    }
  }

  // onImageClick(state: string) {
  //   if (this.isCustomer === true) {
  //     if (state !== 'age' && state !== 'gender') {
  //       this.userDataService.onStateChange.next(state);
  //     }
  //   } else {
  //     this.userDataService.onStateChange.next(state);
  //   }
  //   if (this.router.url === '/summary') {
  //     this.router.navigate(['/home']);
  //   }
  // }

  onSummaryClicked() {
    if (this.userDataService.isUserDataValid()) {
      // this.userDataService.onStateChange.next(state);

      this.router.navigate(['needanalysis/summary', this.customerId]);
    } else if (!this.userDataService.isUserDataValid()) {
      alert('Please Enter all fields');
    }
  }
}
