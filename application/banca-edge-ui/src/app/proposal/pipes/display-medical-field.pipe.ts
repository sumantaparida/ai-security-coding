import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { maxvalueVal } from '@app/shared/validators/maxValue.validator';

@Pipe({
  name: 'displayMedicalFieldPipe',
})
export class DisplayMedicalFieldPipe implements PipeTransform {
  transform(
    policyQuestion,
    parentValue,
    formGroup: FormGroup,
    currentControl,
    answers,
  ): boolean {
    //   console.log('in DisplayFormFieldPipe question', policyQuestion);
    //   console.log('in DisplayFormFieldPipe formGroup', formGroup);
    //   console.log('in DisplayFormFieldPipe dependentControlName', dependentControlName);
    //   console.log('in DisplayFormFieldPipe currentControl', currentControl);
      console.log('in DisplayFormFieldPipe answers', answers);
    
      let shouldFormBeVisible = false;
      
      if(policyQuestion.isFieldDependent){
        if(policyQuestion?.fieldVisibleIfParentValue?.findIndex(val=>val === parentValue) === -1){
            if(formGroup.get(currentControl)){
              formGroup.removeControl(currentControl);
            } 
            const reqAns = answers.find(ans => ans.questionId === currentControl)
            reqAns.answerDetails.forEach((memberAnswer) => {
                memberAnswer.answer = '';
              });
            shouldFormBeVisible = false;
            
        } else {
            if(!formGroup.get(currentControl)){
                formGroup.addControl(currentControl,new FormControl('',Validators.required) );
              } 
            shouldFormBeVisible = true;
        }
    } else {
        shouldFormBeVisible = true;
    }
    console.log(currentControl,shouldFormBeVisible)
    return shouldFormBeVisible
    } 
    // console.log('finally checking the answer', shouldFormBeVisible, formGroup);
   
  }
