import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Pipe({ name: 'getMembers' })
export class GetMembersPipe implements PipeTransform {

    transform(answers: any[], question, section, insurers: any[], form: FormGroup): any[] {
        const currentAnswer = answers.find(answer => answer.questionId === question.questionId);
        // console.log('got section', section);
        if (section.onlyForFemaleInsurers) {
            const maleInsurers = insurers.filter(insurer => insurer.gender === 'M');
            if (maleInsurers.length > 0) {
                maleInsurers.forEach(male => {
                    // console.log('each male insurers', male);
                    const currentMemberAnswerDetails = currentAnswer.answerDetails.find(memberAnswer => memberAnswer.memberId === male.id);
                    currentMemberAnswerDetails.answer = question.positiveAnswer === 'Y' ? 'Y' : 'N';
                    Object.keys(currentMemberAnswerDetails.details).forEach(detail => {
                        currentMemberAnswerDetails.details[detail] = '';
                    });
                    // console.log('current member answer details', currentMemberAnswerDetails);
                    form.get(`member-${male.id}-question-${question.questionId}`).setValue(false);
                    form.get(`member-${male.id}-question-${question.questionId}`).disable();
                    form.get(`member-${male.id}-question-${question.questionId}-desc`).setValue('');
                    form.get(`member-${male.id}-question-${question.questionId}-desc`).disable();
                });
            }

        }
        // console.log('answer', currentAnswer);
        if (currentAnswer) {
            return currentAnswer.answerDetails;
        }
        return [];
    }

}
