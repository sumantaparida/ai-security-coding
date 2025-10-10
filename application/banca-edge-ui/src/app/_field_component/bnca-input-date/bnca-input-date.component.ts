import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-bnca-input-date',
  templateUrl:'./bnca-input-date.component.html',
  styleUrls: ['./bnca-input-date.component.css'],
  encapsulation: ViewEncapsulation.Emulated 
})
export class BncaInputDateComponent implements OnInit {
  @Input() control:FormControl;
  @Input() label:String;
  @Input() min:number;
  @Input() max:number;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() focusEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() inputEvent: EventEmitter<any> = new EventEmitter<any>();
  focused: boolean = false;
  enteredVal: boolean = false;
  disabled: boolean = false;
   constructor() { }

  ngOnChanges(changes){
    console.log('changes',changes)
    if(this.control.disabled){
      console.log('disabled')
      this.disabled = true;
     }
  }


  ngOnInit(): void { this.control?.valueChanges.subscribe(val=>{
      console.log(val)
        if(!val) {
        this.enteredVal = false
        this.focused = false
        }
      })
    // console.log('init',this.control)
  }

  ngOnDestroy(): void {
    // console.log('destroy',this.label)
    // Unsubscribe to prevent memory leaks
  }
  

  emitClickEvent(event: any): void {
    console.log(event.value)
    this.clickEvent.emit(event.value);
  }

  emitChangeEvent(event: any): void {
    this.changeEvent.emit(event);
  }

  emitFocusEvent(event: any): void {
    this.focused = true;
    this.focusEvent.emit(event);
  }

  emitBlurEvent(event: any): void {
    this.blurEvent.emit(event);
    if (!this.control.value) {
      this.focused = false;
    }
  }


}

