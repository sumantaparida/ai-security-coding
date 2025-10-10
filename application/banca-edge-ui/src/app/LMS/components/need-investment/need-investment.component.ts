import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LmsService } from '@app/LMS/services/lms.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-need-investment',
  templateUrl: './need-investment.component.html',
  styleUrls: ['./need-investment.component.css'],
})
export class NeedInvestmentComponent implements OnInit {
  @Input() state;
  @Input() form;

  @Output() stateChange = new EventEmitter();

  @ViewChild('otherDescription') myDOMEle: ElementRef;

  investmentGoals = [
    { checked: false, id: 'Q_11_1', description: 'Health/ Protection' },
    { checked: false, id: 'Q_11_2', description: 'Child university education in India' },
    { checked: false, id: 'Q_11_3', description: 'Child university education overseas' },
    { checked: false, id: 'Q_11_4', description: 'Wealth Creation' },
    { checked: false, id: 'Q_11_5', description: 'Retirement' },
    { checked: false, id: 'Q_11_6', description: 'Regular Income ' },
    { checked: false, id: 'Q_11_7', description: 'Property' },
    { checked: false, id: 'Q_11_8', description: 'Investment' },
    { checked: false, id: 'Q_11_9', description: 'Others' },
    // {id:'Q_11_10',description:'Tot'},

    // {id:'',description:''},
  ];

  investmentKeys = [
    'Q_11_1',
    'Q_11_2',
    'Q_11_3',
    'Q_11_4',
    'Q_11_5',
    'Q_11_6',
    'Q_11_7',
    'Q_11_8',
    'Q_11_9',
  ];

  // 'Q_11_9_1',

  investmentForm: FormGroup;

  totalInvestment;

  optionInvestmentForm;

  calculatedResponse;

  needAnalysis;

  selectedOption;

  checked = false;

  readonlyB = false;
  readonlyA = false;

  nextDisable = true;

  otherDescription;

  isDescError;

  constructor(
    private lmsService: LmsService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    console.log('came innn', state);
    this.investmentForm = new FormGroup({});
    this.optionInvestmentForm = new FormGroup({});
    // this.investmentGoals.forEach((goal) => {
    //   console.log(goal.id);
    //   this.investmentForm.addControl(
    //     goal.id,
    //     new FormControl('', [Validators.max(999), Validators.pattern(/^(?!0)\d+$/)]),
    //   );
    // });
    this.optionInvestmentForm.addControl('Q_11_10', new FormControl());
    this.optionInvestmentForm.addControl('secondQuestion', new FormControl());
    this.optionInvestmentForm.addControl('Q_12_A', new FormControl());
    this.optionInvestmentForm.addControl('Q_12_B', new FormControl());
    this.optionInvestmentForm.addControl(
      'crRate',
      new FormControl('', [
        Validators.min(1),
        Validators.max(7),
        Validators.pattern(/^(?!0)[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
      ]),
    );
    this.optionInvestmentForm.addControl(
      'yrRate',
      new FormControl('', [
        Validators.min(1),
        Validators.max(7),
        Validators.pattern(/^(?!0)[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
      ]),
    );

    this.optionInvestmentForm.get('secondQuestion').valueChanges.subscribe((eve) => {
      console.log(eve);
      this.selectedOption = eve;
      if (eve == 1) {
        this.readonlyB = true;
        this.readonlyA = false;
        this.optionInvestmentForm.addControl('Q_12_A', new FormControl());
        this.optionInvestmentForm.get('Q_12_A').setValidators([
          Validators.required,
          Validators.max(99),
          Validators.pattern(/^(?!0)\d+$/),
          // Validators.pattern(/^(?!0)\d+$/)
        ]);
        this.optionInvestmentForm.get('Q_12_B')?.reset();
        this.optionInvestmentForm.get('yrRate')?.reset();

        this.optionInvestmentForm.removeControl('Q_12_B');
        // this.optionInvestmentForm.removeControl('yrRate');

        this.needAnalysis = [];
        this.nextDisable = true;

        // this.optionInvestmentForm.updateValueAndValidity();
      } else {
        this.readonlyA = true;
        this.readonlyB = false;

        this.optionInvestmentForm.addControl('Q_12_B', new FormControl());
        this.optionInvestmentForm
          .get('Q_12_B')
          .setValidators([
            Validators.required,
            Validators.max(9999999),
            Validators.pattern(/^[1-9][0-9]*$/),
          ]);
        this.optionInvestmentForm.get('Q_12_A')?.reset();
        this.optionInvestmentForm.get('crRate')?.reset();

        this.optionInvestmentForm.removeControl('Q_12_A');
        // this.optionInvestmentForm.removeControl('crRate');

        this.needAnalysis = [];
        this.nextDisable = true;

        // this.optionInvestmentForm.updateValueAndValidity();
      }
    });

    this.optionInvestmentForm.get('Q_12_A').valueChanges.subscribe((event) => {
      this.nextDisable = true;
    });

    this.optionInvestmentForm.get('Q_12_B').valueChanges.subscribe((event) => {
      this.nextDisable = true;
    });

    this.optionInvestmentForm.get('crRate').valueChanges.subscribe((event) => {
      this.nextDisable = true;
    });

    this.optionInvestmentForm.get('yrRate').valueChanges.subscribe((event) => {
      this.nextDisable = true;
    });

    this.optionInvestmentForm.get('crRate').valueChanges.subscribe((eve) => {
      console.log('rate=', this.optionInvestmentForm.get('crRate').value);
      if (this.optionInvestmentForm.get('crRate').value) {
        const val = this.optionInvestmentForm.get('crRate').value;
        console.log('val-==', val);
        this.form.addControl(
          'crRate',
          new FormControl('', Validators.pattern(/^(?!0)[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/)),
        );
        this.form.get('crRate').setValue(val);
        console.log(
          'rate=',
          this.optionInvestmentForm.get('crRate').value,
          this.form.get('crRate').value,
        );
      }
    });

    this.optionInvestmentForm.get('yrRate').valueChanges.subscribe((eve) => {
      console.log('rate=', this.optionInvestmentForm.get('yrRate').value);
      if (this.optionInvestmentForm.get('yrRate').value) {
        const val = this.optionInvestmentForm.get('yrRate').value;
        console.log('val-==', val);
        this.form.addControl(
          'yrRate',
          new FormControl('', Validators.pattern(/^(?!0)[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/)),
        );
        this.form.get('yrRate').setValue(val);
        console.log(
          'rate=',
          this.optionInvestmentForm.get('yrRate').value,
          this.form.get('yrRate').value,
        );
      }
    });

    this.investmentForm.valueChanges.subscribe((e) => {
      this.optionInvestmentForm?.get('Q_12_A')?.reset();
      this.optionInvestmentForm?.get('Q_12_B')?.reset();
      if (
        this.investmentForm.valid &&
        this.optionInvestmentForm?.get('Q_12_A')?.valid &&
        this.optionInvestmentForm?.get('Q_12_A')?.value &&
        this.optionInvestmentForm?.get('crRate')?.valid
      ) {
        this.nextDisable = false;
      } else {
        this.nextDisable = true;
      }

      let total = 0;

      Object.keys(this.investmentForm.value).forEach((key) => {
        if (key !== 'descrp') {
          total = +total + +this.investmentForm.get(key)?.value;
          console.log(total, '=total');
          this.totalInvestment = total;
        }
      });

      console.log('sum=', this.totalInvestment, this.investmentForm);
    });

    this.investmentForm.get('Q_11_9').value?.valueChanges.subscribe((event) => {
      console.log('inside value change');
      this.investmentForm.addControl(
        'descrp',
        new FormControl(Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)),
      );
    });
  }

  addAll() {
    let total = 0;
    this.investmentForm.valueChanges.subscribe((e) => {
      Object.keys(this.investmentForm.value).forEach((key) => {
        total = total + this.investmentForm.get(key).value;
        console.log(total, '=total');
      });
    });
  }

  nextState() {
    if (this.investmentForm.valid) {
      let obj = this.investmentForm.value;
      for (let key in obj) {
        if (obj[key] !== null && obj[key] !== '') {
          this.form.addControl(key, new FormControl(obj[key] * 100000));
        }
      }

      this.form.get('newInvestmentValue').setValue('true');
      if (this.investmentForm.get('Q_11_9')) {
        this.form.addControl('Q_11_9_1', new FormControl(this.investmentForm.get('descrp').value));
      }
      this.form.addControl('Q_11_10', new FormControl(this.totalInvestment * 100000));
      if (this.selectedOption == 1) {
        this.form.addControl(
          'Q_12_A',
          new FormControl(this.optionInvestmentForm.get('Q_12_A')?.value),
        );
      } else {
        this.form.addControl(
          'Q_12_B',
          new FormControl(this.optionInvestmentForm.get('Q_12_B')?.value),
        );
      }
      console.log('fform==', this.form, 'form in new', this.investmentForm);

      this.onStateChange();
    }
  }

  onStateChange() {
    this.stateChange.emit(true);
  }

  checkList(i) {
    console.log('new invest', this.investmentForm);

    this.optionInvestmentForm?.get('Q_12_A')?.reset();
    this.optionInvestmentForm?.get('Q_12_B')?.reset();
    this.investmentGoals[i].checked = this.investmentGoals[i].checked == false ? true : false;
    this.investmentForm.get(this.investmentGoals[i].id)?.reset();
    // this.optionInvestmentForm?.get('Q_12_A')?.reset()
    // this.optionInvestmentForm?.get('Q_12_B')?.reset()
    console.log('iii', i, this.investmentGoals);
    this.investmentGoals.forEach((goal) => {
      if (goal.checked === true) {
        this.investmentForm.addControl(
          goal.id,
          new FormControl('', [
            Validators.required,
            Validators.max(999),
            Validators.pattern(/^(?!0)\d+$/),
          ]),
        );

        // this.investmentForm
        //   .get(goal.id)
        //   .setValidators([
        //     Validators.required,
        //     Validators.max(999),
        //     Validators.min(1),
        //     Validators.pattern(/^(?!0)\d+$/),
        //   ]);
      } else if (goal.checked === false) {
        this.investmentForm.removeControl(goal.id);

        // this.investmentForm
        // .get(goal.id).clearValidators()
      }
    });

    if (this.investmentForm.get('Q_11_9')) {
      let regex = '[a-zA-Z][a-zA-Z ]+';
      this.investmentForm.addControl(
        'descrp',
        new FormControl('', [Validators.required, Validators.pattern(regex)]),
      );
      console.log('new invest', this.investmentForm);
    } else {
      this.investmentForm.removeControl('descrp');
    }

    if (
      this.investmentForm.valid &&
      this.optionInvestmentForm?.get('Q_12_A')?.valid &&
      this.optionInvestmentForm?.get('Q_12_A')?.value &&
      this.optionInvestmentForm?.get('crRate')?.valid
    ) {
      this.nextDisable = false;
    } else {
      this.nextDisable = true;
    }
  }

  calculate(val) {
    let proceed = true;

    // if (this.investmentForm.get('Q_11_9')?.value) {
    //   if (
    //     this.myDOMEle?.nativeElement?.value

    //   ) {
    //     this.otherDescription = this.myDOMEle?.nativeElement?.value;
    //     this.isDescError = false;
    //     proceed = true;
    //   } else {
    //     this.isDescError = true;
    //     this.myDOMEle?.nativeElement?.reset;
    //     proceed = false;
    //   }
    // }

    if (this.investmentForm.valid && proceed) {
      this.optionInvestmentForm.get('Q_11_10').setValue(this.totalInvestment);
      let payload = {
        sumInsured: this.totalInvestment * 100000,
        typeOfCalculation: '',
      };
      if (val == 1) {
        // payload.sumInsured = this.investmentForm.get('Q_11_10').value;
        payload['numberOfYears'] = this.optionInvestmentForm.get('Q_12_A')?.value;
        payload.typeOfCalculation = 'PREMIUM';
      } else {
        // payload.sumInsured = this.investmentForm.get('Q_11_10').value;
        payload['monthlyPayment'] = this.optionInvestmentForm.get('Q_12_B')?.value;
        payload.typeOfCalculation = 'TENURE';
      }
      if (this.optionInvestmentForm.get('crRate')?.value) {
        payload['customRate'] = this.optionInvestmentForm.get('crRate')?.value;
      }
      if (this.optionInvestmentForm.get('yrRate')?.value) {
        payload['customRate'] = this.optionInvestmentForm.get('yrRate')?.value;
      }
      this.loaderService.showSpinner(true);
      this.lmsService.checkNeedAnalysis(payload).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);

          if (res['returnCode'] === 0) {
            this.nextDisable = false;
            console.log('response=', res);
            this.loaderService.showSpinner(false);

            let respone = res;

            this.calculatedResponse = res;
            this.needAnalysis = this.calculatedResponse.needAnalysis;
          } else {
            const dialogR = this.dialog.open(PolicyErrorModalComponent, {
              data: res['returnMessage'],
              panelClass: 'dialog-width',
            });
          }
        },
        (err) => {
          this.loaderService.showSpinner(false);
          const dialogR = this.dialog.open(PolicyErrorModalComponent, {
            data: err['returnMessage'],
            panelClass: 'dialog-width',
          });
        },
      );
      // console.log('');
    }
  }

  onReset() {
    this.investmentGoals.forEach((goal) => {
      goal.checked = false;
    });
    console.log(this.investmentGoals);
    this.investmentGoals.forEach((goal) => {
      console.log(goal.id);
      this.investmentForm.get(goal.id)?.reset();
    });

    this.optionInvestmentForm.get('Q_12_A')?.reset();
    this.optionInvestmentForm.get('Q_12_B')?.reset();

    this.optionInvestmentForm.get('crRate')?.reset();
    this.optionInvestmentForm.get('yrRate')?.reset();
    this.optionInvestmentForm.get('secondQuestion')?.reset();

    this.nextDisable = true;
    this.needAnalysis = [];
  }

  disableCalculate1() {
    console.log('valid', this.investmentForm, this.optionInvestmentForm.get('Q_12_A')?.value);
    if (
      this.investmentForm.valid &&
      this.totalInvestment > 0 &&
      this.optionInvestmentForm.get('Q_12_A')?.valid &&
      this.optionInvestmentForm.get('Q_12_A')?.value &&
      this.optionInvestmentForm.get('crRate')?.valid
    ) {
      return false;
    }
    return true;
  }

  disableCalculate2() {
    if (
      this.optionInvestmentForm.get('Q_12_B')?.value &&
      this.investmentForm.valid &&
      this.totalInvestment > 0 &&
      this.optionInvestmentForm.get('Q_12_B')?.valid &&
      this.optionInvestmentForm.get('yrRate')?.valid
    ) {
      return false;
    }
    return true;
  }
}
