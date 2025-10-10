import { Validators } from "@angular/forms";
import { maxvalueVal } from "@app/shared/validators/maxValue.validator";

const getValidatorsArray = (form): any[] => {
    const validatorsArray = [];
    Object.keys(form.validators).forEach((validatorKey) => {
      if (validatorKey === 'required') {
        validatorsArray.push(Validators.required);
      } else if (validatorKey === 'minLength') {
        validatorsArray.push(Validators.minLength(form.validators.minLength));
      } else if (validatorKey === 'maxLength') {
        validatorsArray.push(Validators.maxLength(form.validators.maxLength));
      } else if (validatorKey === 'min') {
        validatorsArray.push(Validators.min(form.validators.min));
      } else if (validatorKey === 'max') {
        validatorsArray.push(Validators.max(form.validators.max));
      } else if (validatorKey === 'email' && form.validators[validatorKey]) {
        validatorsArray.push(Validators.email);
      } else if (validatorKey === 'pattern') {
        validatorsArray.push(Validators.pattern(form.validators.pattern));
      } else if (validatorKey === 'maxValue') {
        validatorsArray.push(maxvalueVal(form.validators[validatorKey]));
      }
    });
    return validatorsArray;
  }


  export default getValidatorsArray;