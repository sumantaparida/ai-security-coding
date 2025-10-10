import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-dcb-need-analysis',
  templateUrl: './dcb-need-analysis.component.html',
  styleUrls: ['./dcb-need-analysis.component.css'],
})
export class DcbNeedAnalysisComponent implements OnInit {
  @Input() state;

  @Input() form: FormGroup;

  @Output() riskChange = new EventEmitter();

  @Output() riskScore = new EventEmitter();

  @Output() stateChange = new EventEmitter();

  dcbForm: FormGroup;

  questions = [
    {
      question: 'Please tell us your age.',
      questionId: 'Q_01',
      options: [
        { id: '40', value: 'Below 35 years' },
        { id: '30', value: '35 – 50 years' },
        { id: '20', value: '50 – 60 years' },
        { id: '10', value: 'More than 60 years' },
      ],
    },
    {
      question: 'Please estimate the duration of your investment till withdrawal.',
      questionId: 'Q_02',
      options: [
        { id: '10', value: 'up to 3 years' },
        { id: '20', value: '3 – 5 years' },
        { id: '30', value: '5 – 10 years' },
        { id: '40', value: '10 years and above' },
      ],
    },
    {
      question: 'What outcome do you expect in an investment portfolio?',
      questionId: 'Q_03',
      options: [
        { id: '10', value: 'Preserve Asset Value' },
        { id: '20', value: 'Generate Current Income' },
        { id: '30', value: 'Current Income and Long Term Growth' },
        { id: '40', value: 'Long Term Growth' },
      ],
    },
    {
      question: 'What is your expectation regarding your income over the next 5 years?',
      questionId: 'Q_04',
      options: [
        { id: '40', value: 'It will increase substantially' },
        { id: '30', value: 'It will increase slightly' },
        { id: '20', value: 'It will remain stable' },
        { id: '10', value: 'It will decline' },
      ],
    },
    {
      question:
        'In the unfortunate event of being deprived of regular source of income, what would be the estimated duration for which your current savings will help sustain your current lifestyle?',
      questionId: 'Q_05',
      options: [
        { id: '10', value: 'Less than 3 months' },
        { id: '20', value: '3 – 9 months' },
        { id: '30', value: '9 – 12 months' },
        { id: '40', value: 'More than 1 year' },
      ],
    },
    {
      question: 'How familiar are you with investment/capital markets?',
      questionId: 'Q_06',
      options: [
        { id: '10', value: 'No experience at all' },
        { id: '20', value: 'Have some basic knowledge of investment/capital markets' },
        {
          id: '30',
          value:
            'You understand that markets and investments fluctuate. Various investment options have different income and taxation concerns',
        },
        {
          id: '40',
          value:
            ' You are experienced with all investment sectors and fully understand the various factors that influence market performance',
        },
      ],
    },
    {
      question:
        'You are on a TV game show and you win ₹ 50,000. You have a choice between keeping your money and risking it to win a higher amount. Select your next action',
      questionId: 'Q_07',
      options: [
        { id: '10', value: 'Happy with ₹50,000 and will quit the show' },
        { id: '20', value: 'Risk ₹50,000 on 50% chance of winning ₹2,00,000' },
        { id: '30', value: 'Risk ₹50,000 on 25% chance of winning ₹3,00,000' },
        { id: '40', value: 'Risk ₹50,000 on 10% chance of winning ₹5,00,000' },
      ],
    },
    {
      question:
        'Which one of the following best describes your feeling after making an investment?',
      questionId: 'Q_08',
      options: [
        { id: '10', value: 'Not bothered as it’s a well-informed investment decision' },
        { id: '20', value: 'Are satisfied and content with the decision' },
        { id: '30', value: 'Never sure if you have made the right decision' },
        { id: '40', value: 'Usually get very worried and tense' },
      ],
    },
    {
      question:
        'The stock market has dropped by 25%, and your investment in shares / mutual funds has also dropped by 25%, what would you do?',
      questionId: 'Q_09',
      options: [
        { id: '10', value: 'Horror - you will sell everything' },
        { id: '20', value: 'You will sell part of your investment to cut your losses' },
        { id: '30', value: 'You are not bothered and are confident of market recovery' },
        { id: '40', value: 'You would invest more to take advantage of falling market' },
      ],
    },
    {
      question:
        'If you have 4 options to choose from, which of the given ‘estimated return’ scenario would you like to invest your money in?',
      questionId: 'Q_10',
      options: [
        { id: '10', value: 'Worst +2%, Average +5%, Best +8%' },
        { id: '20', value: 'Worst +4%, Average +7%, Best +10%' },
        { id: '30', value: 'Worst -15%, Average +8%, Best +15%' },
        { id: '40', value: 'Worst -25%, Average +12%, Best +25% ' },
      ],
    },
  ];

  riskProfile;

  constructor(
    public dialog: MatDialog,
    public userService: UserDataService,
    private userData: UserDataService,
  ) {}

  ngOnInit() {
    this.dcbForm = new FormGroup({});
    this.questions.forEach((question) => {
      this.dcbForm.addControl(question.questionId, new FormControl('', Validators.required));
    });
    let age = this.userData.getUserInfo()?.age;
    let score;
    if (age < 35) {
      score = 40;
    } else if (age >= 35 && age < 50) {
      score = 30;
    } else if (age >= 50 && age <= 60) {
      score = 20;
    } else if (age > 60) {
      score = 10;
    }
    this.dcbForm.get('Q_01').setValue(score.toString());
    this.dcbForm.controls['Q_01'].disable();

    // console.log('form--?', this.dcbForm.getRawValue());
    // this.userService.riskProfileQuestions().subscribe(questions =>{
    //   this.questions = questions;
    // })
  }

  onChange() {
    if (this.dcbForm.valid) {
      let age = 18;
      if (this.form.get('ageValue')) {
        age = +this.form.get('ageValue').value;
      }
      let sum = 0;
      // if (age < 35) {
      //   sum = 40;
      // } else if (age >= 35 && age <= 50) {
      //   sum = 30;
      // } else if (age >= 51 && age <= 60) {
      //   sum = 20;
      // } else {
      //   sum = 10;
      // }
      Object.keys(this.dcbForm.controls).forEach((control) => {
        sum += +this.dcbForm.get(control).value;
      });
      console.log('got the sum', sum);
      if (sum <= 130) {
        this.riskChange.emit(4);
        this.riskProfile = 'Risk Profile - Risk Averse';
      } else if (sum >= 131 && sum <= 200) {
        this.riskChange.emit(5);
        this.riskProfile = 'Risk Profile - Conservative';
      } else if (sum >= 201 && sum <= 260) {
        this.riskChange.emit(6);
        this.riskProfile = 'Risk Profile - Moderately Conservative';
      } else if (sum >= 261 && sum <= 320) {
        this.riskChange.emit(7);
        this.riskProfile = 'Risk Profile - Moderately Aggressive';
      } else {
        this.riskChange.emit(8);
        this.riskProfile = 'Risk Profile - Aggressive';
      }
      console.log('sum=', sum);
      this.userService.onScoreChange.next(sum);
      this.riskScore.emit(sum);
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        height: '150px',
        width: '79px !important',
        data: this.riskProfile,
        panelClass: 'dialog-risk-type',
      });
      dialogRef.afterClosed().subscribe((data) => {
        // navigate
      });
    }
  }

  nextState() {
    if (this.dcbForm.valid) {
      Object.keys(this.form.value).forEach((key) => {
        this.questions.forEach((question) => {
          if (question.questionId === key) {
            this.form.get(key).setValue(this.dcbForm.get(question.questionId).value);
          }
        });
      });
      let rawValue = this.dcbForm.getRawValue();
      this.form.get('Q_01').setValue(rawValue['Q_01']);

      this.stateChange.emit(true);
      console.log(this.form);
    }
  }

  showOrHideNextBtn() {
    if (this.dcbForm.valid) {
      return true;
    } else {
      return false;
    }
  }
}
