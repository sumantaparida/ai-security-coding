import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

interface RadioOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-bnca-input-radio',
  templateUrl:'./bnca-input-radio.component.html',
  styleUrls: ['./bnca-input-radio.component.css']
})


export class BncaInputRadioComponent implements OnInit {
  @Input() control:FormControl;
  @Input() options: RadioOption[];
  @Input() name:string;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() focusEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() inputEvent: EventEmitter<any> = new EventEmitter<any>();
  selectedValue: any;
  disabled:boolean = false;
   constructor() { }

  ngOnChanges(changes){
    // console.log('changes',changes)
    if(changes.hasOwnProperty('control') && this.control){
      console.log(this.control.value)
      if(this.control.value === null || this.control.value === undefined){
        this.selectedValue = ''
        console.log(this.options,this.selectedValue)
      } else {
        this.selectedValue = this.control.value
      }
      if(this.control.disabled){
        console.log('disabled')
        this.disabled = true;
       }
    }
  }
  ngOnInit(): void {
    this.control?.valueChanges.subscribe(val=>{
      console.log(val)
        if(!val) {
        this.selectedValue = '';
        }
      })
    // console.log('init',this.control)
  }
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
  }

  
  // Emit individual events to the parent component
  emitClickEvent(selectedOption): void {
    // console.log('selectedOption',selectedOption)
    this.control.setValue(selectedOption)
    this.clickEvent.emit(selectedOption);
  }

  emitChangeEvent(event: any,value): void {
    this.selectedValue = value;
    this.changeEvent.emit(event);
  }

  emitFocusEvent(event: any): void {
    this.focusEvent.emit(event);
  }

  emitBlurEvent(event: any): void {
    this.blurEvent.emit(event);
  }

  emitInputEvent(event: any): void {
    this.inputEvent.emit(event);
  }

  isSelected(value: any): boolean {
    return this.selectedValue === value;
  }


  
}

