import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { CovidNegativeFollowUpFormComponent } from '../covid-negative-follow-up-form/covid-negative-follow-up-form.component';
import { MedicalFormModalComponent } from '../medical-negative-follow-up-form/medical-form-modal.component';
import { MedicalNegativeFollowUpPopupFormComponent } from '../medical-negative-follow-up-popup-form/medical-negative-follow-up-popup-form.component';

@Component({
  selector: 'app-medical-section',
  templateUrl: './medical-section.component.html',
  styleUrls: ['./medical-section.component.css'],
})
export class MedicalSectionComponent implements OnInit {
  @Input() section;

  @Input() insurers;

  @Input() policyData;

  @Input() policyQuestionsForm: FormGroup;

  @Input() insuredData;

  @Input() answers;

  @Input() screenName;

  @Input() isEditable;

  memberId;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.screenName === 'Primary Insured') {
      this.memberId = 0;
    } else if (this.screenName === 'Secondary Insured') {
      this.memberId = 1;
    } else {
      this.memberId = 0;
    }
  }

  onRadioChange(event, question, questionId) {
    const currentAnswer = this.answers.find((answer) => answer.questionId === questionId);
    const currentMemberAnswer = currentAnswer.answerDetails.filter(
      (answerDetail) => answerDetail.memberId === this.memberId,
    );
    currentMemberAnswer.forEach((memberAnswer) => {
      memberAnswer.answer = this.policyQuestionsForm.get(
        `${questionId}-member-${this.memberId}`,
      ).value;
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
    if (
      question.questionId === 'covid-12' ||
      question.questionId === 'covid-16' ||
      question.questionId === 'covid-18'
    ) {
      const dialogRef1 = this.dialog.open(CovidNegativeFollowUpFormComponent, {
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
      dialogRef1.afterClosed().subscribe(() => {
        // navigate
      });
    } else {
      const dialogRef = this.dialog.open(MedicalFormModalComponent, {
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
