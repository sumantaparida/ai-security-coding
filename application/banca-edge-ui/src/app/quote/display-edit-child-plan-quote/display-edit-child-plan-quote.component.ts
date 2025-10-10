import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  ElementRef,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-display-edit-child-plan-quote',
  templateUrl: './display-edit-child-plan-quote.component.html',
  styleUrls: ['./display-edit-child-plan-quote.component.css'],
})
export class DisplayEditChildPlanQuoteComponent implements OnInit, OnChanges {
  pptOptions = {
    floor: 5,
    ceil: 50,
  };

  ptOptions = {
    floor: 10,
    ceil: 50,
  };

  isShownSumInsured = false;

  needHideSumInsured = 'Need Help?';

  isShownCoverTenure = false;

  isShownprePay = false;

  isShownpolicyCover = false;

  needHideCoverTenure = 'Need Help?';

  needHideprepay = 'Need Help?';

  needHidepolicycover = 'Need Help?';

  isDialogOpened = false;

  isEditDialogOpened = false;

  isEdit = true;

  isEditMobile = false;

  disabled = true;

  quoteInput;

  policyType;

  policyKind;

  membersArr;

  membersArrCopy;

  editQuoteForm: FormGroup;

  properserdobDate;

  insurerdobDate;

  childdobDate;

  mobilebasepre;

  isShowDesktop = true;

  quoteId;

  isGq = false;

  ptMaxValue = 0;

  ptMinValue = 0;

  pptMaxValue = 0;

  pptMinValue = 0;

  filterPtandPPT;

  ppValue;

  premiumPaid = [
    { id: '0', value: 'Single' },
    { id: '1', value: 'Annual' },
    { id: '2', value: 'Half yearly' },
    { id: '4', value: 'Quarterly' },
    { id: '12', value: 'Monthly' },
  ];

  @Output() isEditTrue = new EventEmitter<boolean>();

  @Output() changeInQuoteInput = new EventEmitter<any>();

  @Input() isDoneEditing;

  @Input() finalQuote;

  @Output() updateResults: EventEmitter<any> = new EventEmitter();

  @ViewChild('investpre') PropInvest: ElementRef;

  @ViewChild('investpremob') PropInvestMob: ElementRef;

  @ViewChild('paidPre') PropPaid: ElementRef;

  @ViewChild('paidPremob') PropPaidMob: ElementRef;

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {}

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('finalQuote') && this.finalQuote !== undefined) {
      this.generateFinalQuoteData();
    }
    if (changes.hasOwnProperty('isDoneEditing')) {
      if (this.isDoneEditing) {
        this.PropInvest.nativeElement.readOnly = true;
        // this.PropPaid.nativeElement.readOnly = true;
        this.disabled = true;
      }
    }
  }

  ngOnInit(): void {
    this.editQuoteForm = new FormGroup({
      inputOne: new FormControl(''),
      inputTwo: new FormControl(''),
    });
  }

  editMobileQuote() {
    this.PropInvestMob.nativeElement.readOnly = false;
    // this.PropPaidMob.nativeElement.readOnly = false;
    this.isGq = true;
    this.disabled = false;
  }

  generateNewQuote() {
    this.updateResults.emit();
    this.isEditMobile = false;
    this.isGq = false;
  }

  generateFinalQuoteData() {
    this.ptMaxValue = Math.max.apply(
      Math,
      this.finalQuote?.productQuote.map((val) => val.pt),
    );
    this.ptMinValue = Math.min.apply(
      Math,
      this.finalQuote?.productQuote.map((val) => val.pt),
    );
    this.pptMaxValue = Math.max.apply(
      Math,
      this.finalQuote?.productQuote.map((val) => val.ppt),
    );
    this.pptMinValue = Math.min.apply(
      Math,
      this.finalQuote?.productQuote.map((val) => val.ppt),
    );
    this.quoteInput = this.finalQuote?.quoteInput;
    const proposerDob = new Date(this.finalQuote?.quoteInput?.proposerDob);
    const proposeryear = proposerDob.getFullYear();
    const proposermonth = ('0' + (proposerDob.getMonth() + 1)).slice(-2);
    const proposerdt = ('0' + proposerDob.getDate()).slice(-2);
    this.properserdobDate = proposeryear + '-' + proposermonth + '-' + proposerdt;
    const insuredDob = new Date(this.finalQuote?.quoteInput?.insuredDob);
    const insuredyear = insuredDob.getFullYear();
    const insuredmonth = ('0' + (insuredDob.getMonth() + 1)).slice(-2);
    const insureddt = ('0' + insuredDob.getDate()).slice(-2);
    this.insurerdobDate = insuredyear + '-' + insuredmonth + '-' + insureddt;
    const childBirth = new Date(this.finalQuote?.quoteInput?.childDob);
    const ChildYear = childBirth.getFullYear();
    const childMonth = ('0' + (childBirth.getMonth() + 1)).slice(-2);
    const childdate = ('0' + childBirth.getDate()).slice(-2);
    this.childdobDate = ChildYear + '-' + childMonth + '-' + childdate;
    this.membersArr = this.quoteInput?.members;
    if (this.finalQuote?.quoteInput?.startType === 'sa') {
      this.editQuoteForm.get('inputOne').setValue(this.finalQuote?.quoteInput?.sa);
    } else {
      this.editQuoteForm.get('inputOne').setValue(this.finalQuote?.quoteInput?.ap);
    }
    this.editQuoteForm
      .get('inputTwo')
      .setValue(this.finalQuote?.quoteInput?.selectedMode.toString());
  }

  toggleShow(event) {
    if (event === 'sumInsured') {
      this.isShownSumInsured = !this.isShownSumInsured;
      if (this.isShownSumInsured) {
        this.needHideSumInsured = 'Hide help';
      } else {
        this.needHideSumInsured = 'Need help?';
      }
    } else if (event === 'coverTenure') {
      this.isShownCoverTenure = !this.isShownCoverTenure;
      if (this.isShownCoverTenure) {
        this.needHideCoverTenure = 'Hide help';
      } else {
        this.needHideCoverTenure = 'Need help?';
      }
    }
  }

  onChangeQuoteInput() {
    this.changeInQuoteInput.emit({
      inputOne: this.editQuoteForm.get('inputOne').value,
      inputTwo: this.editQuoteForm.get('inputTwo').value,
    });
  }

  editQuote() {
    this.isEditTrue.emit(true);
    this.isEdit = true;
    this.isDoneEditing = false;
    this.PropInvest.nativeElement.readOnly = false;
    // this.PropPaid.nativeElement.readOnly = false;
    this.disabled = false;
  }

  onEditMobile() {
    this.isEditMobile = !this.isEditMobile;
    this.isShowDesktop = !this.isEditMobile;
  }

  backrouteToQuestion() {
    this.route.params.subscribe((params) => {
      if (params.quoteId) {
        this.quoteId = params.quoteId;
      }
    });
    this.router.navigate(['quote/child-plan', this.quoteId]);
  }

  ptOnchange(event) {
    this.changeInQuoteInput.emit({
      minValue: event.value,
      highValue: event.highValue,
    });
  }

  pptOnchange(event) {
    this.changeInQuoteInput.emit({
      minPPTValue: event.value,
      higPPTValue: event.highValue,
    });
  }
}
