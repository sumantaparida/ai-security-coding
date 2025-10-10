import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { MoreDetailLifeComponent } from '../more-detail-life/more-detail-life.component';
import { QuoteService } from '../quote.service';
import { LoaderService } from '@app/_services/loader.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-quote-life-insurance',
  templateUrl: './quote-life-insurance.component.html',
  styleUrls: ['./quote-life-insurance.component.css'],
})
export class QuoteLifeInsuranceComponent implements OnInit, OnDestroy {
  isShownSumInsured = false;

  needHideSumInsured = 'Need Help?';

  isShownCoverTenure = false;

  needHideCoverTenure = 'Need Help?';

  isDialogOpened = false;

  isEditDialogOpened = false;

  quoteId;

  finalQuote;

  showloader;

  isLoading;

  isEditTrue = false;

  isDoneEditing = false;

  newSumAssured;

  newTenure;

  isErrorDiv = false;

  investpremium;

  paidPremium;

  yearPremium;

  coverPolicy;

  minumumValue = 10;

  higherValue = 25;

  minimumPPTValue = 5;

  higherPPTValue = 25;

  minimumPayout = 0;

  higherPayout = 25;

  errorDetail;

  proposerRelationMaster;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  public getQuoteSubscription: Subscription;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private quoteService: QuoteService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.quoteId) {
        this.quoteId = params.quoteId;
      }
    });
    // this.isLoading = true;
    this.loaderService.showSpinner(true);
    this.callQuoteApi();
  }

  ngOnDestroy() {
    if (this.quoteService.fetchQuoteSuccess) {
      this.quoteService.fetchQuoteSuccess.unsubscribe();
    }
    if (this.getQuoteSubscription) {
      this.getQuoteSubscription.unsubscribe();
    }
  }

  callQuoteApi() {
    this.quoteService.getInsuredRelationship('Life', 'ENDW').subscribe((relationship) => {
      console.log('printing realtiosnhip', relationship);
      this.proposerRelationMaster = relationship;
    });
    this.getQuoteSubscription = this.quoteService
      .getHealthQuote(this.quoteId)
      .subscribe((finalQuoteRes) => {
        console.log('printing getQuoteSubscrioption', finalQuoteRes);

        this.finalQuote = finalQuoteRes;
        // this.isLoading = false;

        this.loaderService.showSpinner(false);
        // this.investpremium = this.finalQuote?.productQuote[0]?.premiums[1]?.basePremium;
        // this.paidPremium = 'Annual';
      });
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

  onChangeInInput(event) {
    if (event.inputOne) {
      this.investpremium = event.inputOne;
    }
    if (event.inputTwo) {
      this.paidPremium = event.inputTwo;
    }
    if (event.minValue) {
      this.minumumValue = event.minValue;
    }
    if (event.highValue) {
      this.higherValue = event.highValue;
    }
    if (event.minPPTValue) {
      this.minimumPPTValue = event.minPPTValue;
    }
    if (event.higPPTValue) {
      this.higherPPTValue = event.higPPTValue;
    }
    if (event.minPayoutPeriodValue) {
      this.minimumPayout = event.minPayoutPeriodValue;
    }
    if (event.highPayoutPeriodValue) {
      this.higherPayout = event.highPayoutPeriodValue;
    }
  }

  updateResults() {
    // this.isLoading = true;
    this.loaderService.showSpinner(true);
    this.isDoneEditing = true;
    const data = this.finalQuote.quoteInput;
    if (this.finalQuote?.quoteInput?.startType === 'sa') {
      data['sa'] = this.investpremium;
    } else {
      data['ap'] = this.investpremium;
    }
    data['selectedMode'] = this.paidPremium;
    this.quoteService.fetchQuoteSuccess.unsubscribe();
    this.quoteService.productQuoteArray = [];
    this.quoteService.postSubmitLifeQuote(data).subscribe(
      (result) => {
        const quote = result;
        if (quote['numQuotesExpected'] > 0) {
          this.quoteId = quote['quoteId'];
          this.callQuoteApi();
          this.isEditTrue = false;
          this.isErrorDiv = false;
        } else {
          // this.isLoading = false;
          this.loaderService.showSpinner(false);
          this.isEditTrue = false;
          this.isErrorDiv = true;
          this.errorDetail =
            'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.isEditTrue = false;
        this.isErrorDiv = true;
        if (error.error.details) {
          this.errorDetail = error.error.details;
        } else if (error.error.error) {
          this.errorDetail = error.error.error;
        } else {
          this.errorDetail =
            'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
        }
      },
    );
  }

  onEditClicked(event) {
    this.isEditTrue = true;
    this.isDoneEditing = false;
  }

  cancelEdit() {
    this.isEditTrue = false;
    this.isDoneEditing = true;
  }

  moreDetails() {
    if (!this.isDialogOpened) {
      const dialogRef = this.dialog.open(MoreDetailLifeComponent, {
        panelClass: 'more-details-width',
      });
      dialogRef.afterOpened().subscribe(() => {
        this.isDialogOpened = true;
      });
      dialogRef.afterClosed().subscribe(() => {
        this.isDialogOpened = false;
      });
    }
  }
}
