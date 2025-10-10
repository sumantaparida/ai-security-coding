import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export class CustomValidators {
  public static notDefaultBranch(comparisonString: string): ValidatorFn {
    return (control: AbstractControl) => {
      const ret: ValidationErrors = { 'notDefaultBranch': true };
      const myvalue = control.value;
     
      if (!myvalue||myvalue.id == comparisonString) {
        
        return ret;
      }
      else {

      }

      return null;
    }
  }
  
   public static pattern(reg: RegExp) : ValidatorFn {
        return (control: AbstractControl):ValidationErrors => {
          const ret: ValidationErrors = { 'postalCode': true };
         
          var value = <string>control.value;
          if (value) {
            if (value.match(reg)) {
             
              control.setErrors(null);
              return null;
            }
            else {
              control.setErrors(ret);
              
              return ret;
            }
              
          }
          else
            return null;
        }
    }
    static underEighteen(control: AbstractControl) {
      const ret: ValidationErrors = { 'underEighteen': true };
      const dob = control.value;
      const today = moment().startOf('day');
      const delta = today.diff(dob, 'years', false);
      //console.log("delta",delta);
      //console.log("dob",dob);
      //console.log("today",today);
      
      if (delta < 17) {
       
       // return ret;
      }
      else {
      
      }

      //return null;
    }
  }



 
