import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MedicalQuestionFollowUpQuestions } from '../form-data';
import { ProposalService } from '../services/proposal.service';

@Pipe({ name: 'displayNegativeAnswerFollowUpSection' })
export class DisplayNegativeAnswerFollowUpSection implements PipeTransform {

    constructor(private dialog: MatDialog, private proposalService: ProposalService) { }

    transform(answers: any[], question, form: FormGroup, value): boolean {
        // console.log('answers in pipe', answers);
        // console.log('question in pipe', question);
        // console.log('form in pipe', form);
        // console.log('value in pipe', value);
        // question.questionType = 'YESNOFORM'
        // question.formData = MedicalQuestionFollowUpQuestions;
        const answerForCurrentQuestion = answers.find(answer => answer.questionId === question.questionId);
        const positiveAnswerForCurrentQuestion = question.positiveAnswer.substring(0, 1);
        let fillingFirstTime = true;
        if (question.questionType === 'YESNO') {
            return false;
        }
        // console.log('positiveAnswerForCurrentQuestion in pipe', positiveAnswerForCurrentQuestion);
        if (value && value !== '' && positiveAnswerForCurrentQuestion !== value && !question.restrictOnNegative) {
            // console.log(answerForCurrentQuestion);
            answerForCurrentQuestion.answerDetails.forEach(answerDetail => {
                if (positiveAnswerForCurrentQuestion !== answerDetail.answer) {
                    form.addControl(`member-${answerDetail.memberId}-question-${question.questionId}`, new FormControl(true, Validators.required));
                    // question.questionType = 'YESNOFORM'
                    if (question.questionType === 'YESNOFORM') {
                        // question.formData = MedicalQuestionFollowUpQuestions;
                        question.formData.forEach(formElement => {
                            const validators = this.getValidatorsArray(formElement);
                            form.addControl(`member-${answerDetail.memberId}-question-${question.questionId}-${formElement.controlName}`, new FormControl(answerDetail.details[formElement.controlName], validators));
                        });
                    } else {
                        form.addControl(`member-${answerDetail.memberId}-question-${question.questionId}-desc`, new FormControl(answerDetail.details.desc, Validators.required));
                    }
                } else {
                    form.addControl(`member-${answerDetail.memberId}-question-${question.questionId}`, new FormControl(false, Validators.required));
                    form.addControl(`member-${answerDetail.memberId}-question-${question.questionId}-desc`, new FormControl(null));
                    form.get(`member-${answerDetail.memberId}-question-${question.questionId}-desc`).disable();
                }
            });
            // console.log('form in pipe', form);
            return true;
        } else {
            form.removeControl('shouldHaveAtleastOneInsured');

            answerForCurrentQuestion.answerDetails.forEach(answerDetail => {
                answerDetail.answer = value;
                if (question.questionType === 'YESNOFORM') {
                    question.formData.forEach(formElement => {
                        answerDetail.details[formElement.valueType] = '';
                        form.removeControl(`member-${answerDetail.memberId}-question-${question.questionId}-${formElement.controlName}`);
                    });
                } else {
                    answerDetail.details.desc = '';
                }
                form.removeControl(`member-${answerDetail.memberId}-question-${question.questionId}`);
                form.removeControl(`member-${answerDetail.memberId}-question-${question.questionId}-desc`);
            });
            return false;
        }
    }

    getValidatorsArray(formData): any[] {
        const validatorsArray = [];
        Object.keys(formData.validators).forEach(validatorKey => {
            if (validatorKey === 'required') {
                validatorsArray.push(Validators.required);
            } else if (validatorKey === 'minLength') {
                validatorsArray.push(Validators.minLength(formData.validators.minLength));
            } else if (validatorKey === 'maxLength') {
                validatorsArray.push(Validators.maxLength(formData.validators.maxLength));
            } else if (validatorKey === 'min') {
                validatorsArray.push(Validators.min(formData.validators.min));
            } else if (validatorKey === 'max') {
                validatorsArray.push(Validators.max(formData.validators.max));
            } else if (validatorKey === 'email' && formData.validators[validatorKey]) {
                validatorsArray.push(Validators.email);
            } else if (validatorKey === 'pattern') {
                validatorsArray.push(Validators.pattern(formData.validators.pattern));
            }
        });
        return validatorsArray;
    }

}
