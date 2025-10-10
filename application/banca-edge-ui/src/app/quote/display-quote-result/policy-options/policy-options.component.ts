import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { maxvalueVal } from '@app/shared/validators/maxValue.validator';
@Component({
  selector: 'app-policy-options',
  templateUrl: './policy-options.component.html',
  styleUrls: ['./policy-options.component.css']
})
export class PolicyOptionsComponent implements OnInit {
  @Input() addOns:[];
  @Input() policyOptions:{}[];
  @Input() mobileView:boolean;
  @Input() customiseOptions:boolean;
  @Input() quoteOptionForm: FormGroup;
  // @Output() policyOptionChanges: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateQuote: EventEmitter<any> = new EventEmitter<any>();

  
    constructor(){}

    ngOnChanges(changes){
      console.log(changes)
      // if(changes.hasOwnProperty(this.quoteOptionForm)){
          
      // }
    }
        
    ngOnInit(): void {
      
    }

    onRadioChange(e,controlName,){
      // console.log(e,this.quoteOptionForm)
      // const val = e.target.value
      // this.quoteOptionForm.get(controlName)?.setValue(val)
      // this.policyOptionChanges.emit(val)
      this.checkDependentForm()
    }

    highlight(addOn){
      // console.log('hi')
      addOn.highlighted = !addOn.highlighted
    }
  
    dropdown(addOn){
      addOn.optionClick = !addOn.optionClick
     
    }

    optionSelect(addOn,option){
      if(option.key !== '0'){
        addOn.value = addOn.name + ' - ' +option.value 
        addOn.selectedVal = +option.key
      } else {addOn.value = addOn.name; addOn.selectedVal=''}
    }

    closeOptions(){
      this.closeTab.emit(false)
    }
  
    checkDependentForm(){
      setTimeout( ()=>{this.policyOptions?.forEach((option)=>{
        if(option['isDependent']){
            if(option['fieldVisibleIfVal'].includes(this.quoteOptionForm?.get(option['dependentControlName'])?.value)){
              // console.log('yo',option)
                option['isVisible'] = true;
            } else {
              option['isVisible'] = false;
            }
          
        } 
      })},5)
     
    }


    onUpdate(){
      this.updateQuote.emit(true)
      if(this.mobileView){
        this.closeTab.emit(false)
      }
    }

    emitBlurEvent(event){
      console.log('hi2')
      this.updateQuote.emit(true)

    }

    emitFocus(event){
      console.log('hi')
    }
}