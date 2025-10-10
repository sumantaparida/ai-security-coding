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
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-edit',
  templateUrl: './quote-edit.component.html',
  styleUrls: ['./quote-edit.component.css'],
})
export class QuoteEditComponent implements OnInit, OnChanges {
  isShownSumInsured = false;
  needHideSumInsured = 'Need Help?';
  isShownCoverTenure = false;
  needHideCoverTenure = 'Need Help?';
  isDialogOpened = false;
  isEditDialogOpened = false;
  isEdit = true;
  isEditMobile = false;
  quoteInput;
  policyType;
  policyKind;
  membersArr;
  membersArrCopy;
  quoteId;
  isGq = false;
  editQuoteForm: FormGroup;
  @Output() isEditTrue = new EventEmitter<boolean>();
  @Output() changeInQuoteInput = new EventEmitter<any>();
  @Input() isDoneEditing;
  @Input() finalQuote;
  @Output('updateResults') updateResults: EventEmitter<any> = new EventEmitter();

  // @ViewChild('sa') PropSa: ElementRef;
  @ViewChild('tenure') PropTenure: ElementRef;
  // @ViewChild('saMob') PropSaMob: ElementRef;
  @ViewChild('tenureMob') PropTenureMob: ElementRef;

  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('finalQuote') && this.finalQuote !== undefined) {
      this.generateFinalQuoteData();
    }
    if (changes.hasOwnProperty('isDoneEditing')) {
      if (this.isDoneEditing) {
        //  this.PropSa.nativeElement.readOnly = true;
        this.PropTenure.nativeElement.readOnly = true;
      }
    }
  }

  ngOnInit(): void {
    this.editQuoteForm = new FormGroup({
      // inputOne: new FormControl(''),
      inputTwo: new FormControl(''),
    });
  }

  generateFinalQuoteData() {
    this.quoteInput = this.finalQuote?.quoteInput;
    this.quoteId = this.finalQuote?.quoteId;
    this.membersArr = this.quoteInput?.members;
    if (this.membersArr !== undefined) {
      this.membersArr.map((arr) => {
        if (arr.rating === 'S') {
          arr['smoking'] = 'Smoker';
        } else if (arr.rating === 'NS') {
          arr['smoking'] = 'Non-Smoker';
        }
      });
      // this.editQuoteForm.get('inputOne').setValue(this.finalQuote?.quoteInput?.sa);
      this.editQuoteForm.get('inputTwo').setValue(this.finalQuote?.quoteInput?.tenure);
      this.membersArr.map((member) => {
        switch (member.relationshipId) {
          case 1:
            member['relation'] = 'Self-Primary Member';
            break;

          case 2:
            member['relation'] = 'Wife';
            break;
          case 3:
            member['relation'] = 'Husband';
            break;
          case 4:
            member['relation'] = 'Daughter';
            break;
          case 5:
            member['relation'] = 'Son';
            break;
          case 6:
            member['relation'] = 'Sister';
            break;
          case 7:
            member['relation'] = 'Mother';
            break;
          case 8:
            member['relation'] = 'Mother in Law';
            break;
          case 9:
            member['relation'] = 'Grand Son';
            break;
          case 10:
            member['relation'] = 'Grand Mother';
            break;
          case 11:
            member['relation'] = 'Grand Father';
            break;
          case 12:
            member['relation'] = 'Grand Daughter';
            break;
          case 13:
            member['relation'] = 'Father in Law';
            break;
          case 14:
            member['relation'] = 'Father';
            break;
          case 15:
            member['relation'] = 'Brother';
            break;
        }
      });
    }
    // this.membersArrCopy = this.membersArrCopy.slice();
    if (this.quoteInput !== undefined) {
      if (this.quoteInput?.productType === 'FF') {
        this.policyType = 'Family Floater';
      } else if (this.quoteInput?.productType === 'INDV') {
        this.policyType = 'Individual';
      }
      if (this.quoteInput?.deductible == 0) {
        this.policyKind = 'New Policy';
      } else if (this.quoteInput?.deductible != 0) {
        this.policyKind = 'Enhance Existing Policy';
      }
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

  onChangeQuoteInput() {
    this.changeInQuoteInput.emit({
      //   inputOne: this.editQuoteForm.get('inputOne').value,
      inputTwo: this.editQuoteForm.get('inputTwo').value,
    });
  }

  editQuote() {
    this.isEditTrue.emit(true);
    this.isEdit = true;
    this.isDoneEditing = false;
    // this.PropSa.nativeElement.readOnly = false;
    this.PropTenure.nativeElement.readOnly = false;

    // if (!this.isEditDialogOpened) {
    //   const dialogRef = this.dialog.open(EditHealthQuoteComponent,{
    //     panelClass: 'my-class'
    //   });
    //   dialogRef.afterOpened().subscribe(result => {
    //     this.isEditDialogOpened = true;
    //     this.isEdit = true;
    //   });
    //   dialogRef.afterClosed().subscribe(res => {
    //     this.isEditDialogOpened = false;
    //   });
    // }
  }
  editMobileQuote() {
    //  this.PropSaMob.nativeElement.readOnly = false;
    this.PropTenureMob.nativeElement.readOnly = false;
    this.isGq = true;
  }
  onEditMobile() {
    this.isEditMobile = !this.isEditMobile;
  }
  generateNewQuote() {
    this.updateResults.emit();
    this.isEditMobile = false;
    this.isGq = false;
  }
  routeToQuestion() {
    if (this.finalQuote.quoteInput.productType === 'Shop') {
      console.log('PRIONTADSASDASDASSD');
      this.router.navigate(['/quote/shop-keepers', this.quoteId]);
    } else {
      this.router.navigate(['/quote/generate-quote', this.quoteId]);
    }
  }
}
