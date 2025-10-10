import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-show-quote-details-mb',
  templateUrl: './show-quote-details-mb.component.html',
  styleUrls: ['./show-quote-details-mb.component.css'],
})
export class ShowQuoteDetailsMB implements OnInit {
  showDetails = false;
  @Input() selectedIndex: number;
  @Input() index: number;
  @Output() closeDetails: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }
  
  ngOnChanges(changes):void {
    console.log(changes)
    if(changes.hasOwnProperty('selectedIndex')){
        console.log(changes)
        if(this.selectedIndex === this.index){
            this.showDetails = true
        } else {
          this.showDetails = false
        }

    }
  }
  ngOnInit(): void {

  }
  colapse(){
    this.showDetails = false
    this.closeDetails.emit(-1)
  }

}