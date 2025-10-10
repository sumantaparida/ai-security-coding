import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-bnca-input-error',
  templateUrl:'./bnca-input-error.component.html',
  styleUrls: ['./bnca-input-error.component.css'],
})
export class BncaInputErrorComponent implements OnInit {
  @Input() control:FormControl;
  @Input() errors:String;
  @Input() label:String;
  errorList = [];

   constructor() { }

  ngOnChanges(changes){
    console.log('changes',changes)
    if(changes.hasOwnProperty('errors')){
      this.errorList=[];
      Object.keys(this.errors).forEach(error=>{
        console.log(error)
        switch (error) {
          case 'required' : this.errorList.push(`${this.label} is required`);
          break;
          case 'pattern'  : this.errorList.push(`${this.label} is invalid`);
          break;
        }
      })
    }
  }


  ngOnInit(): void {
    // console.log('init',this.control)
  }


}

