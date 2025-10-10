import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-bnca-input-text',
  templateUrl:'./bnca-input-text.component.html',
  styleUrls: ['./bnca-input-text.component.css']
})
export class BncaInputTextComponent implements OnInit {
  @Input() control:FormControl;
  @Input() label:String;
  @Input() fetch:String;
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
    // console.log('changes',changes)
    if(changes.hasOwnProperty('control') && this.control){
      // console.log(this.control)
      if(this.control.value){
        this.enteredVal = true
        this.focused = true
      }
      console.log(this.control)
      this.control.disabled ? this.disabled = true : this.disabled = false

    }

  }
  ngOnInit(): void {
    this.control?.valueChanges.subscribe(val=>{
      console.log(val)
        if(!val) {
        this.enteredVal = false
        this.focused = false
        }
      })
    // console.log('init',this.control)
  }

  ngOnDestroy(): void {
    console.log('destroy',this.label)
    // Unsubscribe to prevent memory leaks
  }

   // Emit individual events to the parent component
   emitClickEvent(event: any): void {
    this.clickEvent.emit({clicked:true,value:this.control.value});
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

  emitInputEvent(event: any): void {
   console.log('hi',this.control)
   if (!this.control.value) {
    this.focused = false;
  } else {
    this.focused = true;
  }
    this.control.valid? this.enteredVal = true : this.enteredVal = false;
    this.inputEvent.emit(event);
  }
}

