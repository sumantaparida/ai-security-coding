import { Pipe, PipeTransform } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Pipe({
    name: "displayField",
})
export class DisplayFieldPipe implements PipeTransform {
    transform(currentFormData, allFormData, dependentFormControlValue, formGroup: FormGroup, appData,dependentvalue): unknown {
        // console.log("currentFormData", currentFormData);
        // console.log("allFormData", allFormData);
        // console.log("dependentFormControlValue", dependentFormControlValue);
        // console.log("formGroup", formGroup);
        if (currentFormData.isDependent) {
            const dependentForms = allFormData.filter(
                (form) => form.dependsOnControl === currentFormData.dependsOnControl,
            );
            if (dependentForms && dependentForms.length > 0) {
                dependentForms.forEach((dependentForm) => {
                    // console.log("dependentForm", dependentForm);
                    if(dependentForm.controlName === "licenseStartDate"){
                        let currentDate = new Date()
                        const tenYearsAgo = new Date(currentDate.setFullYear(currentDate.getFullYear() - 10));
                        dependentForm.minDate = tenYearsAgo
                        let newDate = new Date()
                        const nextYear = new Date(newDate.setFullYear(newDate.getFullYear() + 1));
                        dependentForm.maxDate = nextYear
                    }
                    if(dependentForm.controlName === "licenseExpiryDate"){
                        const currentDate = new Date();
                        const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
                        dependentForm.minDate = nextMonth

                    }
                    if (
                        formGroup.get(dependentForm.dependsOnControl) &&
                        dependentForm.fieldVisibleIfDependentValueIn.findIndex(
                            (value) => value === formGroup.get(dependentForm.dependsOnControl).value,
                        ) > -1
                    ) {
                        const validators = this.getValidatorsArray(dependentForm);
                        formGroup.addControl(dependentForm.controlName, new FormControl(appData?appData[dependentForm.controlName]:'', validators));
                    } else {
                        if (formGroup.get(dependentForm.controlName) !== null) {
                            formGroup.removeControl(dependentForm.controlName);
                        }
                    }
                });
            }
            // console.log(currentFormData.controlName,currentFormData.conditionallyDisabled,formGroup)
            if(currentFormData.conditionallyDisabled ){
                if( dependentvalue === ''){
                    formGroup.get(currentFormData.controlName)?.disable()
                } else {
                formGroup.get(currentFormData.controlName)?.enable()
                }
            }
        }
        return (
            !currentFormData.isDependent ||
            (currentFormData.isDependent &&
                currentFormData.fieldVisibleIfDependentValueIn.findIndex(
                    (value) => value === dependentFormControlValue,
                ) > -1)
        );
    }

    getValidatorsArray(formData): any[] {
        const validatorsArray = [];
        Object.keys(formData.validators).forEach((validatorKey) => {
            if (validatorKey === "required") {
                validatorsArray.push(Validators.required);
            } else if (validatorKey === "minLength") {
                validatorsArray.push(Validators.minLength(formData.validators.minLength));
            } else if (validatorKey === "maxLength") {
                validatorsArray.push(Validators.maxLength(formData.validators.maxLength));
            } else if (validatorKey === "min") {
                validatorsArray.push(Validators.min(formData.validators.min));
            } else if (validatorKey === "max") {
                validatorsArray.push(Validators.max(formData.validators.max));
            } else if (validatorKey === "email" ) {
                validatorsArray.push(Validators.email(formData.validators.email));
            } else if (validatorKey === "pattern") {
                validatorsArray.push(Validators.pattern(formData.validators.pattern));
            }
        });
        return validatorsArray;
    }
}
