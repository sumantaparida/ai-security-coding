import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UserDataService } from '../user-data.service';
import { filter } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '@app/_services';
import { OtpSharedModalComponent } from '@app/shared/components/otp-shared-modal/otp-shared-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_services/loader.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { AES } from 'crypto-js';
// import { enc } from 'crypto-js';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnChanges {
  state = 'gender';

  needAnalysisForm: FormGroup;

  sideNavDisplay = ['/home', '/summary'];

  ageGroup;

  gifImage;

  showSideNav = true;

  customerId;

  isCustomer;

  orgCode;

  mobileNo;

  cifNumber;

  riskScore;

  regexNumber = '^[0-4]$';

  dcbRiskQuestions = [
    { questionId: 'Q_01' },
    { questionId: 'Q_02' },
    { questionId: 'Q_03' },
    { questionId: 'Q_04' },
    { questionId: 'Q_05' },
    { questionId: 'Q_06' },
    { questionId: 'Q_07' },
    { questionId: 'Q_08' },
    { questionId: 'Q_09' },
    { questionId: 'Q_10' },
  ];

  investmentGoals = [
    { id: 'Q_11_1' },
    { id: 'Q_11_2' },
    { id: 'Q_11_3' },
    { id: 'Q_11_4' },
    { id: 'Q_11_5' },
    { id: 'Q_11_6' },
    { id: 'Q_11_7' },
    { id: 'Q_11_8' },
    { id: 'Q_11_9' },
    { id: 'Q_11_10' },
    { id: 'Q_11_9_1' },
    { id: 'Q_12_A' },
    { id: 'Q_12_B' },
  ];

  lobType;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userData: UserDataService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    const secretKey = 'ysecretkeyyy098!';
    console.log('CRypto', crypto.AES.encrypt('-123456'.trim(), secretKey.trim()).toString());
    // console.log('CRypto 64', crypto.AES.encrypt('900000'.trim(), key, { iv: iv }));

    let encrypt = crypto.AES.encrypt('1000000'.trim(), secretKey.trim()).toString();
    let decryptedMessage = crypto.AES.decrypt(encrypt, secretKey.trim()).toString(crypto.enc.Utf8);
    console.log('decrypted', decryptedMessage);

    this.accountService.user.subscribe((user) => {
      this.orgCode = user.organizationCode;
    });
    this.route.params.subscribe((params) => {
      if (params.customerId) {
        this.customerId = params.customerId;
        this.lobType = params.lobType;
        this.isCustomer = true;
        this.userData.getCustomerById(this.customerId).subscribe((customer) => {
          this.needAnalysisForm.get('genderValue').setValue(customer['gender']);
          this.userData.setUserInfo('gender', customer['gender']);
          this.mobileNo = customer['mobileNo'];
          this.cifNumber = customer['bankCustomerId'];

          if (customer['gender'] === 'M') {
            this.userData.setDisplayInfo('gender', 'Male');
          } else {
            this.userData.setDisplayInfo('gender', 'FeMale');
          }
          this.ageCheck(customer);
          // const timeDiff = Math.abs(Date.now() - new Date(customer['dob']).getTime());
          // const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
          // this.needAnalysisForm.get('ageValue').setValue(age);
          // this.userData.setDisplayInfo('age', age);
          this.state = 'maritalStatus';

          console.log('customer details', customer, this.needAnalysisForm.get('genderValue').value);
        });
        // this.userData.setCustomerId(this.customerId);
      } else {
        this.customerId = 0;
      }
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (this.sideNavDisplay.findIndex((url) => event.url === url) > -1) {
          this.showSideNav = true;
        } else {
          this.showSideNav = false;
        }
      });

    this.needAnalysisForm = new FormGroup({
      ageValue: new FormControl('', [
        Validators.required,
        Validators.min(18),
        Validators.max(100),
        Validators.minLength(2),
        Validators.maxLength(3),
      ]),
      genderValue: new FormControl('', [Validators.required]),
      maritalStatusValue: new FormControl('', [Validators.required]),
      // occupationValue: new FormControl('', [Validators.required]),
      // socialLifeValue: new FormControl('', [Validators.required]),
      riskTypeValue: new FormControl('', [Validators.required]),
      // houseTypeValue: new FormControl('', [Validators.required]),
      // valuablesValue: new FormControl('', [Validators.required]),
      annualIncomValue: new FormControl('', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]*$'),

        Validators.min(100000),
      ]),
      // savingsValue: new FormControl('', [Validators.required, Validators.min(10000), Validators.max(10000000)]),
      // needLoanValue: new FormControl('', [Validators.required]),
      // kidsNumValue: new FormControl('', [Validators.required]),
      // firstKidAge: new FormControl('', [Validators.required]),
      // secondKidAge: new FormControl('', [Validators.required]),
      // thirdKidAge: new FormControl('', [Validators.required])
    });

    if (this.orgCode === 'DCB') {
      this.needAnalysisForm.addControl(
        'newInvestmentValue',
        new FormControl('', Validators.required),
      );
    }
    this.userData.onStateChange.subscribe((state) => {
      if (this.needAnalysisForm && !this.needAnalysisForm.valid && state !== null) {
        this.needAnalysisForm.get('genderValue').setValue(this.userData.getUserInfo().gender);
        this.needAnalysisForm.get('ageValue').setValue(this.userData.getUserInfo().age);
        this.needAnalysisForm
          .get('maritalStatusValue')
          .setValue(this.userData.getUserInfo().maritalStatus);
        // this.needAnalysisForm.get('socialLifeValue').setValue(this.userData.getUserInfo().socialLife);
        this.needAnalysisForm.get('riskTypeValue').setValue(this.userData.getUserInfo().riskType);
        // this.needAnalysisForm.get('houseTypeValue').setValue(this.userData.getUserInfo().houseType);
        // this.needAnalysisForm.get('valuablesValue').setValue(this.userData.getUserInfo().valuables);
        this.needAnalysisForm
          .get('annualIncomValue')
          .setValue(this.userData.getUserInfo().annualIncome);
        // this.needAnalysisForm.get('savingsValue').setValue(this.userData.getUserInfo().savings);
        // this.needAnalysisForm.get('needLoanValue').setValue(this.userData.getUserInfo().needLoan);
        // this.needAnalysisForm.get('occupationValue').setValue(this.userData.getUserInfo().occupation);
      }
      if (state) {
        this.state = state;
      }
    });

    if (this.orgCode === 'DCB') {
      this.dcbRiskQuestions.forEach((question) => {
        this.needAnalysisForm.addControl(
          question.questionId,
          new FormControl('', Validators.required),
        );
      });
    }
    console.log('form=>', this.needAnalysisForm, Object.keys(this.needAnalysisForm.value));
  }

  ngOnChanges() {
    this.ageGroup = this.userData.getUserInfo().ageGroup;
    this.startAnimation();
  }

  ageCheck(customer) {
    const timeDiff = Math.abs(Date.now() - new Date(customer['dob']).getTime());
    const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    this.needAnalysisForm.get('ageValue').setValue(age);
    this.userData.setUserInfo('age', age);
    this.userData.setDisplayInfo('age', age);
    if (age <= 30) {
      this.userData.setUserInfo('ageGroup', 'young');
    } else if (age > 30 && age < 60) {
      this.userData.setUserInfo('ageGroup', 'elder');
    } else {
      this.userData.setUserInfo('ageGroup', 'senior');
    }
  }

  startAnimation() {
    this.ageGroup = this.userData.getUserInfo().ageGroup;
    if (this.userData.getUserInfo().gender === 'M') {
      if (this.ageGroup === 'young') {
        this.gifImage = 'Boy-1';
      } else if (this.ageGroup === 'elder') {
        this.gifImage = 'Boy-2';
      } else if (this.ageGroup === 'senior') {
        this.gifImage = 'Boy-3';
      }
    } else if (this.needAnalysisForm.get('genderValue').value === 'F') {
      if (this.ageGroup === 'young') {
        this.gifImage = 'Lady-1';
      } else if (this.ageGroup === 'elder') {
        this.gifImage = 'Lady-2';
      } else if (this.ageGroup === 'senior') {
        this.gifImage = 'Lady-3';
      }
    }
  }

  exitNeedAnalysis() {
    this.needAnalysisForm.reset();
    this.router.navigateByUrl('/mycustomers');
  }

  stateTransition() {
    console.log('form', this.needAnalysisForm.value);
    if (this.state === 'gender') {
      if (this.needAnalysisForm.get('genderValue').valid) {
        this.state = 'age';
        this.startAnimation();
      } else {
        this.needAnalysisForm.get('genderValue').markAsDirty();
      }
    } else if (this.state === 'age') {
      if (this.needAnalysisForm.get('ageValue').valid) {
        this.state = 'maritalStatus';
      } else {
        this.needAnalysisForm.get('ageValue').markAsDirty();
      }
    } else if (this.state === 'maritalStatus') {
      if (this.needAnalysisForm.get('maritalStatusValue').valid) {
        if (this.needAnalysisForm.get('maritalStatusValue').value === 'Married') {
          this.state = 'kids';
          this.needAnalysisForm.addControl(
            'kidsNumValue',
            new FormControl('', [Validators.required, Validators.pattern(this.regexNumber)]),
          );
          console.log('inside mrt n kids form', this.needAnalysisForm);
        } else {
          this.state = 'riskType';
        }
      } else {
        this.needAnalysisForm.get('maritalStatusValue').markAsDirty();
      }
      //kids
    } else if (this.state === 'kids') {
      if (this.needAnalysisForm.get('kidsNumValue').valid) {
        this.state = 'riskType';
      } else {
        this.needAnalysisForm.get('kidsNumValue').markAsDirty();
      }
    }
    // else if (this.state === 'occupation') {
    //   if (this.needAnalysisForm.get('occupationValue').valid) {
    //     this.state = 'riskType';
    //   } else {
    //     this.needAnalysisForm.get('occupationValue').markAsDirty();
    //   }

    // }
    else if (this.state === 'riskType') {
      if (this.needAnalysisForm.get('riskTypeValue').valid) {
        if (this.orgCode === 'DCB') {
          this.state = 'newInvestment';
        } else this.state = 'annualIncome';
      } else {
        this.needAnalysisForm.get('riskTypeValue').markAsDirty();
      }
      // house type
    } else if (this.state === 'newInvestment') {
      if (this.needAnalysisForm.get('newInvestmentValue').valid) {
        this.state = 'annualIncome';
      } else {
        this.needAnalysisForm.get('newInvestmentValue').markAsDirty();
      }
    }
    // else if (this.state === 'houseType') {
    //   if (this.needAnalysisForm.get('houseTypeValue').valid) {
    //     this.state = 'valuables';
    //   } else {
    //     this.needAnalysisForm.get('houseTypeValue').markAsDirty();
    //   }
    //   // valuables
    // } else if (this.state === 'valuables') {
    //   if (this.needAnalysisForm.get('valuablesValue').valid) {
    //     this.state = 'annualIncome';
    //   } else {
    //     this.needAnalysisForm.get('valuablesValue').markAsDirty();
    //   }
    //   // annual-income
    // }
    else if (this.state === 'annualIncome') {
      if (this.needAnalysisForm.get('annualIncomValue').valid) {
        // if (this.orgCode === 'DCB') {
        //   this.sendOtp();
        // } else {
        this.state = 'summary';
        // }
      } else {
        this.needAnalysisForm.get('annualIncomValue').markAsDirty();
      }
      // savings
    }
    // else if (this.state === 'savings') {
    //   if (this.needAnalysisForm.get('savingsValue').valid) {
    //     this.state = 'summary';
    //   } else {
    //     this.needAnalysisForm.get('savingsValue').markAsDirty();
    //   }
    //   //need-loan
    // }
    //  else if (this.state === 'needLoan') {
    //   if (this.needAnalysisForm.get('needLoanValue').valid) {
    //     this.state = 'summary';
    //   } else {
    //     this.needAnalysisForm.get('needLoanValue').markAsDirty();
    //   }
    // }

    if (this.state === 'summary' && this.userData.isUserDataValid()) {
      let kidArr = [];
      const secretKey = 'ysecretkeyyy098!';
      const key = btoa(secretKey);
      this.userData.onScoreChange.subscribe((score) => {
        this.riskScore = score;
        console.log('scorerisk', score, this.riskScore);
      });

      // console.log(AES.encrypt('asdsd', 'thisiskey').toString());
      const encryptAnnualIncome = crypto.AES.encrypt(
        this.needAnalysisForm.get('annualIncomValue').value.toString().trim(),
        secretKey.trim(),
      ).toString();
      const needAnalysisData = {
        age: this.needAnalysisForm.get('ageValue').value,
        gender: this.needAnalysisForm.get('genderValue').value,
        maritalStatus: this.needAnalysisForm.get('maritalStatusValue').value,
        // occupation: this.needAnalysisForm.get('occupationValue').value,

        // numKids:2,
        // this.needAnalysisForm.get('genderValue').value,
        // onlinePresence: this.needAnalysisForm.get('socialLifeValue').value,
        riskApetite: this.needAnalysisForm.get('riskTypeValue').value,
        riskScore: this.riskScore,
        // house: this.needAnalysisForm.get('houseTypeValue').value,
        // posessions: this.userData.getUserInfo().valuables,
        annualIncome: this.needAnalysisForm.get('annualIncomValue').value,
        encryptedAnnualIncome: encryptAnnualIncome,
        // disposableIncome: this.needAnalysisForm.get('savingsValue').value,
        // kidAges: [0],
        // numKids: 0
      };
      if (this.orgCode === 'DCB' || this.orgCode === 'SIB') {
        let riskQuestions = {
          Q_01: this.needAnalysisForm.get('Q_01').value,
          Q_02: this.needAnalysisForm.get('Q_02').value,
          Q_03: this.needAnalysisForm.get('Q_03').value,
          Q_04: this.needAnalysisForm.get('Q_04').value,
          Q_05: this.needAnalysisForm.get('Q_05').value,
          Q_06: this.needAnalysisForm.get('Q_06').value,
          Q_07: this.needAnalysisForm.get('Q_07').value,
          Q_08: this.needAnalysisForm.get('Q_08').value,
          Q_09: this.needAnalysisForm.get('Q_09').value,
          Q_10: this.needAnalysisForm.get('Q_10').value,
        };

        // today

        Object.keys(this.needAnalysisForm.value).forEach((key) => {
          this.investmentGoals.forEach((que) => {
            if (que.id == key) {
              riskQuestions[key] = this.needAnalysisForm.get(key).value;
            }
          });
        });
        if (this.needAnalysisForm.get('crRate')) {
          riskQuestions['CUSTOM_RATE'] = this.needAnalysisForm.get('crRate')?.value;
          console.log(
            'crs=',
            riskQuestions['CUSTOM_RATE'],
            this.needAnalysisForm.get('crRate')?.value,
          );
        } else if (this.needAnalysisForm.get('yrRate')) {
          riskQuestions['CUSTOM_RATE'] = this.needAnalysisForm.get('yrRate')?.value;
        }
        needAnalysisData['riskQuestions'] = riskQuestions;
        // console.log('riskyy', needAnalysisData['riskQuestions'], riskQuestions);

        // needAnalysisData['5'] = this.needAnalysisForm.get('5').value;
        // needAnalysisData['6'] = this.needAnalysisForm.get('6').value;
        // needAnalysisData['7'] = this.needAnalysisForm.get('7').value;
        // needAnalysisData['8'] = this.needAnalysisForm.get('8').value;
        // needAnalysisData['9'] = this.needAnalysisForm.get('9').value;
        // needAnalysisData['10'] = this.needAnalysisForm.get('10').value;
        // needAnalysisData['20'] = this.needAnalysisForm.get('20').value;
        // needAnalysisData['30'] = this.needAnalysisForm.get('30').value;
        // needAnalysisData['40'] = this.needAnalysisForm.get('40').value;
      }
      if (this.needAnalysisForm.get('maritalStatusValue').value === 'Single') {
        kidArr.push(0);
        needAnalysisData['numKids'] = 0;
        needAnalysisData['kidAges'] = 0;
      } else if (this.needAnalysisForm.get('maritalStatusValue').value === 'Married') {
        needAnalysisData['numKids'] = this.needAnalysisForm.get('kidsNumValue').value;
      }
      if (this.needAnalysisForm.get('kidsNumValue')?.value == 1) {
        kidArr.push(+this.needAnalysisForm.get('firstKidAge').value);
        needAnalysisData['kidAges'] = this.needAnalysisForm.get('firstKidAge').value;
      } else if (this.needAnalysisForm.get('kidsNumValue')?.value == 2) {
        kidArr.push(+this.needAnalysisForm.get('firstKidAge').value);
        kidArr.push(+this.needAnalysisForm.get('secondKidAge').value);
        needAnalysisData['kidAges'] = +this.needAnalysisForm.get('secondKidAge').value;
      } else if (this.needAnalysisForm.get('kidsNumValue')?.value == 3) {
        kidArr.push(+this.needAnalysisForm.get('firstKidAge').value);
        kidArr.push(+this.needAnalysisForm.get('secondKidAge').value);
        kidArr.push(+this.needAnalysisForm.get('thirdKidAge').value);
        needAnalysisData['kidAges'] = this.needAnalysisForm.get('thirdKidAge').value;
      } else if (this.needAnalysisForm.get('kidsNumValue')?.value == 4) {
        kidArr.push(+this.needAnalysisForm.get('firstKidAge').value);
        kidArr.push(+this.needAnalysisForm.get('secondKidAge').value);
        kidArr.push(+this.needAnalysisForm.get('thirdKidAge').value);
        kidArr.push(+this.needAnalysisForm.get('fourthKidAge').value);
        needAnalysisData['kidAges'] = this.needAnalysisForm.get('fourthKidAge').value;
      }
      this.userData.needAnalysisData(needAnalysisData, this.customerId).subscribe(
        (res) => {
          this.router.navigate(['needanalysis/summary', this.customerId, this.lobType]);
        },
        (err) => {
          const dialogR = this.dialog.open(PolicyErrorModalComponent, {
            data: err.message,
            panelClass: 'dialog-width',
          });
          dialogR.afterClosed().subscribe((data) => {
            // navigate
          });
        },
      );
    } else if (this.state === 'summary' && !this.userData.isUserDataValid()) {
      alert('All fields are need to be filled.');
      // this.needAnalysisForm.controls
      Object.keys(this.needAnalysisForm.controls).filter((control) => {
        if (this.state === 'summary' && !this.needAnalysisForm.get(control).valid) {
          this.state = control.substr(0, control.lastIndexOf('V'));
        }
      });
    }
  }

  // disable next button
  showOrHideNextBtn() {
    if (this.state === 'gender') {
      if (this.needAnalysisForm.get('genderValue').valid && this.userData.getUserInfo().ageGroup) {
        return true;
      } else {
        return false;
      }
    } else if (this.state === 'age') {
      if (this.needAnalysisForm.get('ageValue').valid) {
        return true;
      } else {
        return false;
      }
    } else if (this.state === 'maritalStatus') {
      if (this.needAnalysisForm.get('maritalStatusValue').valid) {
        return true;
        // if (this.needAnalysisForm.get('maritalStatusValue').value === 'Married') {
        //   this.state = 'kids';
        // } else {
        //   this.state = 'occupation';
        // }
      } else {
        return false;
      }
      //kids
    } else if (this.state === 'kids') {
      if (this.needAnalysisForm.get('kidsNumValue')?.valid) {
        if (this.needAnalysisForm.get('kidsNumValue').value == 1) {
          return this.needAnalysisForm.get('firstKidAge')?.valid;
        } else if (this.needAnalysisForm.get('kidsNumValue').value == 2) {
          return (
            this.needAnalysisForm.get('firstKidAge')?.valid &&
            this.needAnalysisForm.get('secondKidAge')?.valid
          );
        } else if (this.needAnalysisForm.get('kidsNumValue').value == 3) {
          return (
            this.needAnalysisForm.get('firstKidAge')?.valid &&
            this.needAnalysisForm.get('secondKidAge')?.valid &&
            this.needAnalysisForm.get('thirdKidAge')?.valid
          );
        } else if (this.needAnalysisForm.get('kidsNumValue').value == 4) {
          return (
            this.needAnalysisForm.get('firstKidAge')?.valid &&
            this.needAnalysisForm.get('secondKidAge')?.valid &&
            this.needAnalysisForm.get('thirdKidAge')?.valid &&
            this.needAnalysisForm.get('fourthKidAge')?.valid
          );
        } else if (this.needAnalysisForm.get('kidsNumValue').value == 0) {
          return true;
        }
      } else {
        return false;
      }
    }
    // else if (this.state === 'occupation') {
    //   if (this.needAnalysisForm.get('occupationValue').valid) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    else if (this.state === 'riskType') {
      if (this.needAnalysisForm.get('riskTypeValue').valid) {
        return true;
      } else {
        return false;
      }
    }
    // house type

    // else if (this.state === 'houseType') {
    //   if (this.needAnalysisForm.get('houseTypeValue').valid) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    // valuables

    // else if (this.state === 'valuables') {
    //   if (this.needAnalysisForm.get('valuablesValue').valid) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    // annual-income
    else if (this.state === 'annualIncome') {
      if (this.needAnalysisForm.get('annualIncomValue').valid) {
        return true;
      } else {
        return false;
      }
      // savings
    }
    //  else if (this.state === 'savings') {
    //   if (this.needAnalysisForm.get('savingsValue').valid) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }

    if (this.state === 'summary' && this.userData.isUserDataValid()) {
      return true;
    } else if (this.state === 'summary' && !this.userData.isUserDataValid()) {
      return false;
      // alert('All fields are need to be filled.');
      // this.needAnalysisForm.controls
      // Object.keys(this.needAnalysisForm.controls).filter(control => {
      //   if (this.state === 'summary' && !this.needAnalysisForm.get(control).valid) {
      //     this.state = control.substr(0, control.lastIndexOf('V'));
      //   }
      // });
    }
  }

  onBackTransition() {
    if (this.state === 'needLoan') {
      this.state = 'savings';
    } else if (this.state === 'savings') {
      this.state = 'annualIncome';
    } else if (this.state === 'annualIncome') {
      this.state = 'valuables';
    } else if (this.state === 'valuables') {
      this.state = 'houseType';
    } else if (this.state === 'houseType') {
      this.state = 'riskType';
    } else if (this.state === 'riskType') {
      this.state = 'socialLife';
    } else if (this.state === 'socialLife') {
      this.state = 'occupation';
    } else if (this.state === 'occupation') {
      if (this.needAnalysisForm.get('maritalStatusValue').value === 'Married') {
        this.state = 'kids';
      } else {
        this.state = 'maritalStatus';
      }
    } else if (this.state === 'kids') {
      this.state = 'maritalStatus';
    } else if (this.state === 'maritalStatus') {
      this.state = 'age';
    } else if (this.state === 'age') {
      this.state = 'gender';
    }
  }

  onStateChange(event) {
    if (event) {
      this.stateTransition();
    }
  }

  sendOtp() {
    this.loaderService.showSpinner(true);
    const otpData = {
      otpKey: this.cifNumber,
      otpRequestDesc: '',

      mobileNo: this.mobileNo,
    };
    this.userData.sendOtp(otpData).subscribe((res) => {
      this.loaderService.showSpinner(false);
      console.log(res);
      if (res['responseStatus'] === 0) {
        this.validateOtp();
      }
    });
  }

  validateOtp() {
    const dialogRef = this.dialog.open(OtpSharedModalComponent, {
      data: {
        appNo: this.cifNumber,
      },
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.state = 'summary';
        console.log('this.state', this.state, this.userData.isUserDataValid());
        this.stateTransition();
      } else {
        const dialogR = this.dialog.open(PolicyErrorModalComponent, {
          data: 'OTP validation Failed, try again',
          panelClass: 'dialog-width',
        });
        dialogR.afterClosed().subscribe((data) => {
          // navigate
        });
      }
    });
  }

  nxtBtn() {
    if (this.orgCode === 'SIB' || this.orgCode === 'DCB') {
      if (this.state === 'riskType' || this.state === 'newInvestment') {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}
