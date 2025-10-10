import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MedicalFormModalComponent } from '../medical-negative-follow-up-form/medical-form-modal.component';
import { MedicalNegativeFollowUpPopupFormComponent } from '../medical-negative-follow-up-popup-form/medical-negative-follow-up-popup-form.component';

@Component({
  selector: 'app-policy-questions',
  templateUrl: './policy-questions.component.html',
  styleUrls: ['./policy-questions.component.css'],
})
export class PolicyQuestionsComponent implements OnInit, OnChanges {
  @Input() policyQuestionsForm: FormGroup;

  @Input() isEditable = true;

  @Input() policyData;

  @Input() answers;

  @Input() travelStartDate;

  @Input() travelEndDate;

  @Input() countryCodes;

  @Input() countriesList;

  @Input() insurers;

  @Input() insuredData;

  @Input() sections = [];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    // console.log('questions', this.policyData);
    // console.log('answers', this.answers);
    // console.log('insurers', this.insurers);
    console.log('policy medical form', this.policyQuestionsForm);
    console.log('sections', this.sections);

    if (this.travelStartDate) {
      // console.log(this.countryCodes);
      this.countryCodes = this.countryCodes.map((i) => Number(i));
      // console.log(this.countryCodes);
    }
  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('isEditable') && !this.isEditable) {
      Object.keys(this.policyQuestionsForm.controls).forEach((control) => {
        this.policyQuestionsForm.get(control).disable();
      });
    } else if (changes.hasOwnProperty('isEditable') && this.isEditable) {
      Object.keys(this.policyQuestionsForm.controls).forEach((control) => {
        this.policyQuestionsForm.get(control).enable();
      });
    }
  }

  onRadioChange(questionId) {
    const currentAnswer = this.answers.find((answer) => answer.questionId === questionId);
    currentAnswer.answerDetails.forEach((memberAnswer) => {
      memberAnswer.answer = this.policyQuestionsForm.get(questionId).value;
    });
  }

  onCheckboxChange(event: MatCheckboxChange, memberAnswer, question) {
    const currentAnswerForQuestion = this.answers.find(
      (answer) => answer.questionId === question.questionId,
    );
    const positiveAnswerForCurrentQuestion = question.positiveAnswer.substring(0, 1);
    if (event.checked && question.questionType === 'YESNOFORM') {
      memberAnswer.answer = question.positiveAnswer === 'Y' ? 'N' : 'Y';
      question.formData.forEach((formElement) => {
        memberAnswer.details[formElement.controlName] = '';
        this.policyQuestionsForm
          .get(
            `member-${memberAnswer.memberId}-question-${question.questionId}-${formElement.controlName}`,
          )
          .enable();
        this.policyQuestionsForm
          .get(
            `member-${memberAnswer.memberId}-question-${question.questionId}-${formElement.controlName}`,
          )
          .setValidators([Validators.required]);
        this.policyQuestionsForm
          .get(
            `member-${memberAnswer.memberId}-question-${question.questionId}-${formElement.controlName}`,
          )
          .setValue(null);
        this.policyQuestionsForm
          .get(
            `member-${memberAnswer.memberId}-question-${question.questionId}-${formElement.controlName}`,
          )
          .updateValueAndValidity();
      });
    } else if (event.checked && question.questionType === 'YESNOPOPUP') {
      memberAnswer.answer = question.positiveAnswer === 'Y' ? 'Y' : 'N';
    } else if (event.checked) {
      if (
        this.policyQuestionsForm.get(
          `member-${memberAnswer.memberId}-question-${question.questionId}-desc`,
        ) &&
        this.policyQuestionsForm.get(
          `member-${memberAnswer.memberId}-question-${question.questionId}-desc`,
        ).status === 'DISABLED'
      ) {
        this.policyQuestionsForm
          .get(`member-${memberAnswer.memberId}-question-${question.questionId}-desc`)
          .enable();
        this.policyQuestionsForm
          .get(`member-${memberAnswer.memberId}-question-${question.questionId}-desc`)
          .setValidators([Validators.required]);
        this.policyQuestionsForm
          .get(`member-${memberAnswer.memberId}-question-${question.questionId}-desc`)
          .setValue(null);
        this.policyQuestionsForm
          .get(`member-${memberAnswer.memberId}-question-${question.questionId}-desc`)
          .updateValueAndValidity();
      }
    } else if (!event.checked && question.questionType === 'YESNOFORM') {
      memberAnswer.answer = question.positiveAnswer === 'Y' ? 'Y' : 'N';
      question.formData.forEach((formElement) => {
        memberAnswer.details[formElement.controlName] = '';
        this.policyQuestionsForm
          .get(
            `member-${memberAnswer.memberId}-question-${question.questionId}-${formElement.controlName}`,
          )
          .setValidators([]);
        this.policyQuestionsForm
          .get(
            `member-${memberAnswer.memberId}-question-${question.questionId}-${formElement.controlName}`,
          )
          .setValue(null);
        this.policyQuestionsForm
          .get(
            `member-${memberAnswer.memberId}-question-${question.questionId}-${formElement.controlName}`,
          )
          .disable();
        this.policyQuestionsForm
          .get(
            `member-${memberAnswer.memberId}-question-${question.questionId}-${formElement.controlName}`,
          )
          .updateValueAndValidity();
      });
    } else if (!event.checked && question.questionType === 'YESNOPOPUP') {
      memberAnswer.answer = question.positiveAnswer === 'Y' ? 'Y' : 'N';
      memberAnswer.details = [];
    } else if (!event.checked) {
      memberAnswer.answer = question.positiveAnswer === 'Y' ? 'Y' : 'N';
      memberAnswer.details.desc = '';
      if (
        this.policyQuestionsForm.contains(
          `member-${memberAnswer.memberId}-question-${question.questionId}-desc`,
        )
      ) {
        this.policyQuestionsForm
          .get(`member-${memberAnswer.memberId}-question-${question.questionId}-desc`)
          .setValidators([]);
        this.policyQuestionsForm
          .get(`member-${memberAnswer.memberId}-question-${question.questionId}-desc`)
          .setValue(null);
        this.policyQuestionsForm
          .get(`member-${memberAnswer.memberId}-question-${question.questionId}-desc`)
          .disable();
        this.policyQuestionsForm
          .get(`member-${memberAnswer.memberId}-question-${question.questionId}-desc`)
          .updateValueAndValidity();
      }
    }

    let flag = false;

    currentAnswerForQuestion.answerDetails.forEach((answerDetail) => {
      if (answerDetail.answer !== '' && answerDetail.answer !== positiveAnswerForCurrentQuestion) {
        flag = true;
      }
    });
    if (!flag) {
      this.policyQuestionsForm.addControl(
        'shouldHaveAtleastOneInsured',
        new FormControl(null, Validators.required),
      );
    } else {
      this.policyQuestionsForm.removeControl('shouldHaveAtleastOneInsured');
    }
  }

  addDescription(event, memberAnswer) {
    memberAnswer.details.desc = event.target.value;
  }

  openNegativeFollowUpForm(memberId, question) {
    const dialogRef = this.dialog.open(MedicalFormModalComponent, {
      data: {
        form: this.policyQuestionsForm,
        insurers: this.insurers,
        question: question,
        answers: this.answers,
        insuredData: this.insuredData,
        memberId,
      },
      panelClass: 'medical-form-dialog',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      // navigate
    });
  }

  openNegativeFollowUpPopup(memberId, question) {
    const dialogRef = this.dialog.open(MedicalNegativeFollowUpPopupFormComponent, {
      data: {
        form: this.policyQuestionsForm,
        insurers: this.insurers,
        question,
        answers: this.answers,
        insuredData: this.insuredData,
        memberId,
      },
      panelClass: 'medical-form-dialog',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      // navigate
    });
  }
}
