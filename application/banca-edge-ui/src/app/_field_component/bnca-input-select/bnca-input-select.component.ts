import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';


interface SelectOption {
  value: any;
  id: string;
}

@Component({
  selector: 'app-bnca-input-select',
  templateUrl:'./bnca-input-select.component.html',
  styleUrls: ['./bnca-input-select.component.css']
})
export class BncaInputSelectComponent implements OnInit {
  @Input() control:FormControl;
  @Input() label:string;
  @Input() options:SelectOption[];
  @Input() searchableDropdown:boolean;
  @Input() searchableDropdownFromAPI:boolean;
  @Input() select:boolean;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() focusEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() inputEvent: EventEmitter<any> = new EventEmitter<any>();

  menuActive: boolean = false
  focused: boolean = false;
  highlight: boolean=false;
  enteredVal: boolean = false;
  disabled: boolean = false;
  value;
  menuPosition: 'above' | 'below' = 'below';
   constructor() { }

  ngOnChanges(changes){
    // console.log('changes',changes)
    if(changes.hasOwnProperty('control') && this.control){
      // console.log(this.control)
       if(!this.control.value) {
        this.value = '';
        this.enteredVal = false
      this.focused = false
      } else if (this.searchableDropdownFromAPI){
        this.value = this.control.value
        this.enteredVal = true
      this.focused = true
      }else {
      console.log(this.options,this.control)
      this.value = this.options.find(option=>option.id == this.control.value).value
      this.enteredVal = true
      this.focused = true
     }
     if(this.control.disabled){
      // console.log('disabled')
      this.disabled = true;
     }
    }
  }

  ngOnInit(): void {

   this.control?.valueChanges.subscribe(val=>{
    console.log(val)
      if(!val) {
        this.value = '';
        this.enteredVal = false
      this.focused = false
      }
    })
    // console.log('changes',this.control)
     //Setting Value from control
    // if(!this.control.value) {this.value = '';} else {
    //   this.value = this.options.find(option=>option.id === this.control.value).value
    //  }
    // console.log('init',this.control)
  }

  ngOnDestroy(): void {
    // console.log('destroy',this.label)
    // Unsubscribe to prevent memory leaks
    // this.controlSubscription.unsubscribe();
  }

  showMenu(event:any){
    // console.log('hi')
    this.focused = true
    this.menuActive = true
    this.highlight=true
    const dropdownHeight = 200; // Adjust this value as needed
    const selectBox = event.currentTarget as HTMLElement;
    // console.log(selectBox)
    const selectBoxRect = selectBox.getBoundingClientRect();
    // console.log(selectBoxRect)
    const dropdownBottom = selectBoxRect.top + selectBoxRect.height + dropdownHeight;
    // console.log(dropdownBottom,window.innerHeight)
    // Check if the dropdown will go beyond the bottom of the viewport
    if (dropdownBottom > window.innerHeight-100) {
      this.menuPosition = 'above';
    } else {
      this.menuPosition = 'below';
    }
    this.menuActive = true;
    this.focusEvent.emit(event)
  }

  emitBlurEvent(event?: any): void {
   if(event) this.blurEvent.emit(event);
   if (!this.control.value) {
    // console.log('hi',this.control.value)
    this.focused = false;
  }
    setTimeout(()=>{this.menuActive = false},5)
   
    this.highlight = false
    this.control.markAsTouched({onlySelf:true})
  }

  emitClickEvent(event:any ,option:SelectOption){
    // event.preventDefault()
    this.control.setValue(option.id)
    this.value = option.value
    this.enteredVal = true;
    this.menuActive = false;
    this.focused = true
    document.getElementById(this.label).blur()
    this.highlight=false
    this.clickEvent.emit(option.id)
  }

  emitInputEvent(event:any){
    // console.log(event)
    if (!this.control.value) {
      this.focused = false;
    } else {
      this.focused = true;
    }
    this.enteredVal = false;
    this.inputEvent.emit(event)
  }


}
