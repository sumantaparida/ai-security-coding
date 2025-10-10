import { Component, OnInit } from '@angular/core';
import { QuotesService } from '@app/quotes/services/quotes.service';

@Component({
  selector: 'app-quote-member-details',
  templateUrl: './quote-member-details.component.html',
  styleUrls: ['./quote-member-details.component.css']
})
export class QuoteMemberDetailsComponent implements OnInit {

  members = [
    { name: 'You', value: 'self', img: '../../../../assets/quote-images/reference-image.svg' },
    { name: 'Spouse', value: 'spouse', img: '../../../../assets/quote-images/female.svg' },
    { name: 'Mother', value: 'mother', img: '../../../../assets/quote-images/mother.svg' },
    { name: 'Father', value: 'father', img: '../../../../assets/quote-images/father.svg' },
    { name: 'Son', value: 'son', img: '../../../../assets/quote-images/boy.svg' },
    { name: 'Daughter', value: 'daughter', img: '../../../../assets/quote-images/girl.svg' },
  ]
  membersDisplay;

  constructor(private quotesService: QuotesService) { }

  ngOnInit() {
    this.quotesService.memberSelected.subscribe(data => {
      console.log(data);

      this.membersDisplay = this.members.filter(item => data.includes(item.value))
      console.log(this.membersDisplay);
    });
    // this.membersDisplayArr =this.compareArr(this.membersArr,this.membersDisplayArr);

  }
  // compareArr(arr1,arr2){
  //   arr1.some(item  =>arr2.includes(item.value))
  // }


}
