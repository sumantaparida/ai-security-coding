import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
    name: 'displayInsuredMedicalSection'
})
export class DisplayInsuredMedicalSectionPipe implements PipeTransform {

    transform(section, insurers: any[], answers: any[], formGroup: FormGroup, screenName): boolean {
        // console.log('section', section);
        // console.log('insurers display', insurers);
        // console.log('answers', answers);
        // console.log('formGroup', formGroup);
        let curentInsurer;
        let currentInsurerId;
        if (screenName === 'Primary Insured') {
            curentInsurer = insurers[0];
            currentInsurerId = insurers[0].id;
        } else if (screenName === 'Secondary Insured') {
            curentInsurer = insurers[1];
            currentInsurerId = insurers[1].id;
        }
        if (section.onlyForFemaleInsurers) {
            if (curentInsurer.gender === 'F') {
                return true;
            } else {
                insurers.forEach(insurer => {
                    section.formData.forEach(form => {
                        const answerForCurrentQuestion = answers.find(answer => answer.questionId === form.questionId);
                        const currentMemberAnswer = answerForCurrentQuestion.answerDetails
                            .filter(answerDetail => answerDetail.memberId === curentInsurer.id);
                        currentMemberAnswer.forEach(answerDetail => {
                            answerDetail.answer = form.positiveAnswer;
                            Object.keys(answerDetail.details).forEach(detail => answerDetail.details[detail] = '');
                        });
                        // console.log('got the current answer', answerForCurrentQuestion);
                        // console.log('printing each form', form);
                        // console.log('questionId', form.questionId);
                        // console.log('the form code', form);
                        formGroup.get(`${form.code}-member-${currentInsurerId}`).setValue(form.positiveAnswer);
                        // console.log('control', `member-${insurer.id}-question-${form.questionId}`);
                    });
                });
                return false;
            }
        } else {
            return true;
        }
    }

}
