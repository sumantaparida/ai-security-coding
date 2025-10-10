import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuotesService } from '@app/quotes/services/quotes.service';

@Component({
  selector: 'app-quote-member-selection',
  templateUrl: './quote-member-selection.component.html',
  styleUrls: ['./quote-member-selection.component.css']
})
export class QuoteMemberSelectionComponent implements OnInit {

  memberSelectionForm: FormGroup;
  memberSelectedArr = [];
  selfImg;
  spouseImg;
  constructor(private quotesService: QuotesService) { }

  ngOnInit() {
    this.memberSelectionForm = new FormGroup({
      gender: new FormControl('male', Validators.required),
      selectedMember: new FormControl('', [Validators.required, Validators.minLength(10),]),
    });
    this.selfImg = '../../../../assets/quote-images/reference-image.svg';
    this.spouseImg = '../../../../assets/quote-images/female.svg';
  }
  onValChange(val) {
    if (val === 'female') {
      this.spouseImg = '../../../../assets/quote-images/reference-image.svg';
      this.selfImg = '../../../../assets/quote-images/female.svg';
    } else {
      this.selfImg = '../../../../assets/quote-images/reference-image.svg';
      this.spouseImg = '../../../../assets/quote-images/female.svg';
    }
    console.log('cahne', val);
    // this.searchForm.get('inputNumber').reset();
  }
  onSelect(val) {
    if (this.memberSelectedArr.indexOf(val) > -1) {
      console.log('index', this.memberSelectedArr.indexOf(val));
      this.memberSelectedArr = this.memberSelectedArr.filter(arr => arr !== val)
    } else {
      this.memberSelectedArr.push(val);

    }
    console.log('prirnting arr', this.memberSelectedArr);
  }

  onNext() {
    this.quotesService.selectedmembers(this.memberSelectedArr);
  }
}
