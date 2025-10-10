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
// import { EditLifeQuoteComponent } from '../edit-life-quote/edit-life-quote.component';
import { QuoteService } from '../quote.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-display-edit-protection-quote',
  templateUrl: './display-edit-protection-quote.component.html',
  styleUrls: ['./display-edit-protection-quote.component.css'],
})
export class DisplayEditProtectionQuoteComponent implements OnInit, OnChanges {
  pptOptions = {
    floor: 0,
    ceil: 50,
  };

  ptOptions = {
    floor: 0,
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

  mobilebasepre;

  isShowDesktop = true;

  quoteId;

  secInsuredDOB;

  isGq = false;

  ptMaxValue = 0;

  ptMinValue = 0;

  pptMaxValue = 0;

  pptMinValue = 0;

  filterPtandPPT;

  ppValue;

  premiumPaid = [
    { id: '1', value: 'Annual' },
    { id: '2', value: 'Semi Annual' },
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

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private QuoteServiceobj: QuoteService,
    private httpclientobj: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('finalQuote') && this.finalQuote !== undefined) {
      this.generateFinalQuoteData();
    }
    if (changes.hasOwnProperty('isDoneEditing')) {
      if (this.isDoneEditing) {
        this.PropInvest.nativeElement.readOnly = true;
        //  this.PropPaid.nativeElement.readOnly = true;
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
    const secInsureddob = new Date(this.finalQuote?.quoteInput?.secInsureddob);
    const secInsuredyear = secInsureddob.getFullYear();
    const secInsuredmonth = ('0' + (secInsureddob.getMonth() + 1)).slice(-2);
    const secInsureddt = ('0' + secInsureddob.getDate()).slice(-2);
    this.secInsuredDOB = secInsuredyear + '-' + secInsuredmonth + '-' + secInsureddt;
    const insuredDob = new Date(this.finalQuote?.quoteInput?.insuredDob);
    const insuredyear = insuredDob.getFullYear();
    const insuredmonth = ('0' + (insuredDob.getMonth() + 1)).slice(-2);
    const insureddt = ('0' + insuredDob.getDate()).slice(-2);
    this.insurerdobDate = insuredyear + '-' + insuredmonth + '-' + insureddt;
    this.membersArr = this.quoteInput?.members;
    this.editQuoteForm.get('inputOne').setValue(this.finalQuote?.productQuote[0]?.sa);
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

  editMobileQuote() {
    this.PropInvestMob.nativeElement.readOnly = false;
    //  this.PropPaidMob.nativeElement.readOnly = false;
    this.isGq = true;
    this.disabled = false;
  }

  generateNewQuote() {
    this.updateResults.emit();
    this.isEditMobile = false;
    this.isGq = false;
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
    this.router.navigate(['quote/life-protection', this.quoteId]);
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
