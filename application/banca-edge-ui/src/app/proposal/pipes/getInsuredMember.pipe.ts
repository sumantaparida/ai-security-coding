import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Pipe({ name: 'getInsuredMembers' })
export class GetInsuredMembersPipe implements PipeTransform {

    transform(answers: any[], question, section, insurers: any[], form: FormGroup, screenName): any[] {
        const currentAnswer = answers.find(answer => answer.questionId === question.questionId);
        let currentInsurerId;
        let currentInsurer;
        if (screenName === 'Primary Insured') {
            currentInsurerId = insurers[0].id;
            currentInsurer = insurers[0];
        } else if (screenName === 'Secondary Insured') {
            currentInsurerId = insurers[1].id;
            currentInsurer = insurers[1];
        }
        if (section.onlyForFemaleInsurers) {
            if (currentInsurer.gender === 'M') {
                const currentMemberAnswerDetails = currentAnswer.answerDetails.find(memberAnswer => memberAnswer.memberId === currentInsurerId);
                currentMemberAnswerDetails.answer = question.positiveAnswer === 'Y' ? 'Y' : 'N';
                Object.keys(currentMemberAnswerDetails.details).forEach(detail => {
                    currentMemberAnswerDetails.details[detail] = '';
                });
                form.get(`member-${currentInsurerId}-question-${question.questionId}`).setValue(false);
                form.get(`member-${currentInsurerId}-question-${question.questionId}`).disable();
                form.get(`member-${currentInsurerId}-question-${question.questionId}-desc`).setValue('');
                form.get(`member-${currentInsurerId}-question-${question.questionId}-desc`).disable();
            }

        }
        if (currentAnswer) {
            return currentAnswer.answerDetails.filter(answerDetail => answerDetail.memberId === currentInsurerId);
        }
        return [];
    }

}
