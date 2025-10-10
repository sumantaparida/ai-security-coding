import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Pipe({ name: 'showInsuredEditLink' })
export class ShowInsuredEditLinkPipe implements PipeTransform {

    transform(insurers, question, form: FormGroup, type, isMemberCheckboxSelected, screenName): boolean {
        let memberId;
        if (screenName === 'Primary Insured') {
            memberId = insurers[0].id;
        } else if (screenName === 'Secondary Insured') {
            memberId = insurers[1].id;
        }
        // console.log('member in ShowEditLinkPipe', memberId);
        // console.log('question in ShowEditLinkPipe', question);
        // console.log('questionId in ShowEditLinkPipe', question.questionId);
        // console.log('form in ShowEditLinkPipe', form);
        // console.log('isMemberCheckboxSelected', isMemberCheckboxSelected);
        if (!isMemberCheckboxSelected) {

        }
        if (form.contains(`member-${memberId}-question-${question?.questionId}-allFilled`)) {
            form.addControl(`member-${memberId}-question-${question?.questionId}-allFilled`, new FormControl(''));
        }
        let filled = true;
        if (question.questionType === 'YESNOFORM' && question.formData && question.formData.length > 0) {
            question.formData.forEach(formElement => {
                // console.log('only to check error', formElement);
                if (form.contains(`member-${memberId}-question-${question?.questionId}-${formElement.controlName}`) &&
                    !form.get(`member-${memberId}-question-${question?.questionId}-${formElement.controlName}`).valid) {
                    filled = false;
                }
            });
        }
        isMemberCheckboxSelected = form.get(`member-${memberId}-question-${question.questionId}`).value;
        // console.log('type', type);
        // console.log('filled', filled);
        // console.log('printing the control', form.contains(`member-${memberId}-question-${question.questionId}-allFilled`));
        // console.log('printing the control', `member-${memberId}-question-${question.questionId}-allFilled`);
        if (filled && question.questionType === 'YESNOFORM' && isMemberCheckboxSelected) {
            form.get(`member-${memberId}-question-${question.questionId}-allFilled`).setValue(true);
        } else {
            form.get(`member-${memberId}-question-${question.questionId}-allFilled`).setValue(false);
        }
        if (question.questionType === 'YESNOFORM' && isMemberCheckboxSelected) {
            return true;
        } else {
            return false;
        }
    }

}
