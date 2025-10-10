import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '@app/_services/loader.service';
import { MoreDetailsHealthComponent } from '../more-details-health/more-details-health.component';
import { QuoteService } from '../quote.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quote-health-hospitalisation',
  templateUrl: './quote-health-hospitalisation.component.html',
  styleUrls: ['./quote-health-hospitalisation.component.css'],
})
export class QuoteHealthHospitalisationComponent implements OnInit, OnDestroy {
  isShownSumInsured = false;

  needHideSumInsured = 'Need Help?';

  isShownCoverTenure = false;

  needHideCoverTenure = 'Need Help?';

  isDialogOpened = false;

  isEditDialogOpened = false;

  quoteId;

  isLoading;

  isEditTrue = false;

  newSumAssured;

  newTenure;

  isErrorDiv = false;

  quoteInput;

  finalQuote;

  isDoneEditing = false;

  customerId;

  isHealthOrPA;

  numQuoteExpected;

  errorDetail;

  public getQuoteSubscription: Subscription;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private quoteService: QuoteService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.quoteId) {
        console.log('params', params);
        this.quoteId = params.quoteId;
        this.numQuoteExpected = params.numQuote;
        sessionStorage.setItem('expected', this.numQuoteExpected);
        if (params.customerId) {
          this.customerId = params.customerId;
        }
      }
    });
    // this.isLoading = true;
    this.loaderService.showSpinner(true);
    this.callQuoteApi();

    // setTimeout(() => {
    //   this.quoteService.getHealthQuote(this.quoteId).subscribe(finalQuoteRes => {
    //     this.finalQuote = finalQuoteRes;
    //     this.isLoading = false;

    //   });
    // }, 5000);
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
    this.getQuoteSubscription = this.quoteService.getHealthQuote(this.quoteId).subscribe(
      (finalQuoteRes) => {
        this.finalQuote = finalQuoteRes;
        // this.isLoading = false;
        this.loaderService.showSpinner(false);

        this.quoteInput = this.finalQuote?.quoteInput;
        this.newSumAssured = this.finalQuote?.quoteInput?.sa;
        this.newTenure = this.finalQuote?.quoteInput?.tenure;
        if (this.customerId !== undefined) {
          this.quoteInput['customerId'] = this.customerId;
          console.log('quoteinput', this.quoteInput);
        }
        this.quoteService.setQuoteInput(this.quoteInput);
      },
      (error) => {
        // this.loaderService.showSpinner(false);
      },
    );
    // setTimeout(() => {
    //   this.quoteService.getHealthQuote(this.quoteId).subscribe(finalQuoteRes => {
    //     this.finalQuote = finalQuoteRes;
    //     // this.isLoading = false;
    //     this.loaderService.showSpinner(false);

    //     this.quoteInput = this.finalQuote.quoteInput;
    //     this.newSumAssured = this.finalQuote.quoteInput.sa;
    //     this.newTenure = this.finalQuote.quoteInput.tenure;
    //     if (this.customerId !== undefined) {
    //       this.quoteInput['customerId'] = this.customerId;
    //       console.log('quoteinput', this.quoteInput);
    //     }
    //     this.quoteService.setQuoteInput(this.quoteInput);

    //   });
    // }, 5000);
  }

  onChangeInInput(event) {
    if (event.inputOne) {
      this.newSumAssured = event.inputOne;
    }
    if (event.inputTwo) {
      this.newTenure = event.inputTwo;
    }
  }

  updateResults() {
    // this.isLoading = true;
    this.loaderService.showSpinner(true);
    this.isDoneEditing = true;
    const data = this.finalQuote.quoteInput;
    data['sa'] = this.newSumAssured;
    data['tenure'] = this.newTenure;
    if (data.productType === 'PA') {
      this.isHealthOrPA = 'submitPAQuote';
      data['income'] = this.newSumAssured;
    } else {
      this.isHealthOrPA = 'submitHealthQuote';
    }
    this.quoteService.fetchQuoteSuccess.unsubscribe();
    this.quoteService.productQuoteArray = [];
    this.quoteService.postSubmitHealthQuote(data, this.isHealthOrPA).subscribe(
      (result) => {
        const quote = result;

        if (quote['numQuotesExpected'] > 0) {
          this.quoteId = quote['quoteId'];
          this.callQuoteApi();
          this.isEditTrue = false;
          this.isErrorDiv = false;
          // this.isDoneEditing = true;
        } else {
          // this.isLoading = false;
          this.loaderService.showSpinner(false);

          this.isEditTrue = false;
          this.isErrorDiv = true;
          // this.isDoneEditing = true;
          this.errorDetail =
            'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';

          // alert('oops');
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

  moreDetails() {
    if (!this.isDialogOpened) {
      const dialogRef = this.dialog.open(MoreDetailsHealthComponent, {
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

  routeToQuestion() {
    this.router.navigate(['quote/health-details']);
  }
}
