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
import { EditMotorQuoteComponent } from '../edit-motor-quote/edit-motor-quote.component';
import { QuoteService } from '../quote.service';
@Component({
  selector: 'app-display-edit-motor-quote',
  templateUrl: './display-edit-motor-quote.component.html',
  styleUrls: ['./display-edit-motor-quote.component.css'],
})
export class DisplayEditMotorQuoteComponent implements OnInit, OnChanges {
  // isEditMobile = false;
  isShownSumInsured = false;

  needHideSumInsured = 'Need Help?';

  isShownCoverTenure = false;

  needHideCoverTenure = 'Need Help?';

  isDialogOpened = false;

  isEditDialogOpened = false;

  dateOfReg;

  policyEndDate;

  @Input() finalQuote;

  allMakeVehical;

  allModelVehical;

  allvariantVehical;

  quoteId;

  editQuoteForm: FormGroup;

  @Output() isEditTrue = new EventEmitter<boolean>();

  @Output() changeInQuoteInput = new EventEmitter<any>();

  @ViewChild('sa') PropSa: ElementRef;

  @ViewChild('tenure') PropTenure: ElementRef;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private QuoteServiceobj: QuoteService,
    private route: ActivatedRoute,
  ) {}

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('finalQuote') && this.finalQuote !== undefined) {
      const regDate = new Date(this.finalQuote?.quoteInput?.dateOfRegistration);
      const year = regDate.getFullYear();
      const month = ('0' + (regDate.getMonth() + 1)).slice(-2);
      const dt = ('0' + regDate.getDate()).slice(-2);
      this.dateOfReg = year + '-' + month + '-' + dt;

      const enddatePolicy = new Date(this.finalQuote?.quoteInput?.prevPolicyEndDate);
      const policyyear = enddatePolicy.getFullYear();
      const policymonth = ('0' + (enddatePolicy.getMonth() + 1)).slice(-2);
      const policydt = ('0' + enddatePolicy.getDate()).slice(-2);
      this.policyEndDate = policyyear + '-' + policymonth + '-' + policydt;
    }
  }

  ngOnInit(): void {
    this.editQuoteForm = new FormGroup({
      inputOne: new FormControl(''),
      inputTwo: new FormControl(''),
    });
    this.QuoteServiceobj.getAllPCMakes().subscribe((res) => {
      this.allMakeVehical = res;
    });
    this.route.params.subscribe((params) => {
      if (params.quoteId) {
        this.quoteId = params.quoteId;
      }
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

  editQuote() {
    if (!this.isEditDialogOpened) {
      const dialogRef = this.dialog.open(EditMotorQuoteComponent, {
        panelClass: 'dialog-width',
      });
      dialogRef.afterOpened().subscribe(() => {
        this.isEditDialogOpened = true;
      });
    }
  }

  backRouteToQuestion() {
    // this.router.navigate(['quote/motor-insurance'], { queryParams: { quoteId: this.quoteId } });
    this.router.navigate(['/quote/motor-insurance', this.quoteId]);
  }
}
