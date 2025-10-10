import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Pipe({ name: 'displaySection' })
export class DisplaySectionPipe implements PipeTransform {
  transform(
    currentSection,
    allSections,
    formValue,
    formGroup: FormGroup,
    key?
  ): boolean {
    if (currentSection.isDependent) {
      const dependentSections = allSections.filter(
        (section) =>
          section.dependsOnControl === currentSection.dependsOnControl
      );
      if (dependentSections && dependentSections.length > 0) {
        dependentSections.forEach((dependentSection) => {
          const currentKey = dependentSection.key
            ? '-' + dependentSection.key
            : '';
          // console.log('dependent control', dependentSection);
          // console.log(formGroup);
          // console.log('dependent control form group', formGroup);
          // console.log(
          //   'dependent control form group',
          //   formGroup.get(dependentSection.dependsOnControl)
          // );
          if (
            dependentSection.sectionVisibleIfDependentValueIn.findIndex(
              (value) =>
                value ===
                formGroup.get(dependentSection.dependsOnControl + currentKey)
                  .value
            ) > -1
          ) {
            dependentSection.formData.forEach((form) => {
              const validators = this.getValidatorsArray(form);
              // formGroup.addControl(
              //   form.controlName,
              //   new FormControl('', validators)
              // );
            });
          } else {
            dependentSection.formData.forEach((form) => {
              if (formGroup.get(form.controlName) !== null) {
                formGroup.removeControl(form.controlName);
              }
            });
          }
        });
      }
    }
    return (
      !currentSection.isDependent ||
      (currentSection.isDependent &&
        currentSection.sectionVisibleIfDependentValueIn.findIndex(
          (value) => value === formValue
        ) > -1)
    );
  }

  getValidatorsArray(formData): any[] {
    const validatorsArray = [];
    Object.keys(formData.validators).forEach((validatorKey) => {
      if (validatorKey === 'required') {
        validatorsArray.push(Validators.required);
      } else if (validatorKey === 'minLength') {
        validatorsArray.push(
          Validators.minLength(formData.validators.minLength)
        );
      } else if (validatorKey === 'maxLength') {
        validatorsArray.push(
          Validators.maxLength(formData.validators.maxLength)
        );
      } else if (validatorKey === 'min') {
        validatorsArray.push(Validators.min(formData.validators.min));
      } else if (validatorKey === 'max') {
        validatorsArray.push(Validators.max(formData.validators.max));
      } else if (
        validatorKey === 'email' &&
        formData.validators[validatorKey]
      ) {
        validatorsArray.push(Validators.email);
      } else if (validatorKey === 'pattern') {
        validatorsArray.push(Validators.pattern(formData.validators.pattern));
      }
    });
    return validatorsArray;
  }
}
