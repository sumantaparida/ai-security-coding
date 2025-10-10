import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { EditMotorQuoteComponent } from '../edit-motor-quote/edit-motor-quote.component';
import { MoreDetailMotorComponent } from '../more-detail-motor/more-detail-motor.component';
import { QuoteService } from '../quote.service';
import { LoaderService } from '@app/_services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quote-motor-insurance',
  templateUrl: './quote-motor-insurance.component.html',
  styleUrls: ['./quote-motor-insurance.component.css'],
})
export class QuoteMotorInsuranceComponent implements OnInit, OnDestroy {
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

  public getQuoteSubscription: Subscription;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private quoteService: QuoteService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.quoteId) {
        this.quoteId = params.quoteId;
        // console.log('quoteId is', this.quoteId);
      }
    });
    //  this.showloader = true;
    this.isLoading = true;
    this.loaderService.showSpinner(true);
    this.getQuoteSubscription = this.quoteService
      .getHealthQuote(this.quoteId)
      .subscribe((finalQuoteRes) => {
        //   this.showloader = false;
        // console.log(finalQuoteRes, ' line no 47 final quote');
        this.finalQuote = finalQuoteRes;
        this.isLoading = false;
        this.loaderService.showSpinner(false);
      });
  }

  ngOnDestroy() {
    if (this.quoteService.fetchQuoteSuccess) {
      this.quoteService.fetchQuoteSuccess.unsubscribe();
    }
    if (this.getQuoteSubscription) {
      this.getQuoteSubscription.unsubscribe();
    }
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
      const dialogRef = this.dialog.open(MoreDetailMotorComponent, {
        panelClass: 'more-details-width',
      });
      dialogRef.afterOpened().subscribe(() => {
        this.isDialogOpened = true;
        // console.log(`Dialog result: ${result}`);
      });
      dialogRef.afterClosed().subscribe(() => {
        this.isDialogOpened = false;
      });
    }
  }

  editQuote() {
    if (!this.isEditDialogOpened) {
      const dialogRef = this.dialog.open(EditMotorQuoteComponent, { panelClass: 'dialog-width' });
      dialogRef.afterOpened().subscribe(() => {
        this.isEditDialogOpened = true;
        // console.log(`Dialog result: ${result}`);
      });
    }
  }
}
