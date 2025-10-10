import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProposalService } from '@app/proposal/services/proposal.service';
import { LoaderService } from '@app/_services/loader.service';
import * as moment from 'moment';

@Component({
  selector: 'app-medical-form-modal',
  templateUrl: './medical-form-modal.component.html',
  styleUrls: ['./medical-form-modal.component.css'],
})
export class MedicalFormModalComponent implements OnInit {
  medicalOptionalForm: FormGroup;

  memberId: number;

  currentQuestion;

  insuredData;

  insurers;

  answers;

  today = new Date();

  year;

  constructor(
    private dialogRef: MatDialogRef<MedicalFormModalComponent>,
    private proposalService: ProposalService,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit() {
    this.medicalOptionalForm = this.data.form;
    this.memberId = this.data.memberId;
    this.currentQuestion = this.data.question;
    this.insurers = this.data.insurers;
    this.answers = this.data.answers;
    this.insuredData = this.data.insuredData;

    //    Assigning MonthYear Date
    // this.currentQuestion.formData.forEach(form => {
    //     if (form.controlType === 'datemonthyear') {
    //         const monthYear = this.medicalOptionalForm.get(`member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}`).value
    //         console.log(monthYear)
    //         const answerforQuestion = this.answers.find(answer => answer.questionId === this.currentQuestion.questionId);
    //         const currentmemberAnswer = answerforQuestion.answerDetails.find(detail => detail.memberId === this.memberId);
    //         const dateAns = currentmemberAnswer.details[form.controlName];
    //         if (`${dateAns}` === monthYear) {
    //             this.medicalOptionalForm.get(`member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}`).setValue(`${monthYear}-01T00:00:00.000Z`)
    //         }
    //     }
    // });
  }

  onDataChanged() {
    // console.log(controlName, valueType, event);
  }

  onSelectionChanged() {
    // console.log(controlName, valueType, event);
  }

  onDateChanged() {
    // console.log(controlName, valueType, event);
  }

  onSaveClicked() {
    const answerForCurrentQuestion = this.answers.find(
      (answer) => answer.questionId === this.currentQuestion.questionId,
    );
    // console.log('printing current answer', answerForCurrentQuestion);
    let allValid = true;
    if (
      answerForCurrentQuestion.answerDetails &&
      answerForCurrentQuestion.answerDetails.length > 0
    ) {
      const currentMemberAnswers = answerForCurrentQuestion.answerDetails.find(
        (memberAnswer) => memberAnswer.memberId === this.memberId,
      );
      this.currentQuestion.formData.forEach((form) => {
        if (
          !this.medicalOptionalForm.get(
            `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}`,
          ).valid
        ) {
          allValid = false;
        }
        if (form.controlType === 'date') {
          currentMemberAnswers.details[form.controlName] = moment(
            this.medicalOptionalForm.get(
              `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}`,
            ).value,
          ).format('YYYY-MM-DD');
        } else if (form.controlType === 'datemonthyear') {
          console.log('inside datemonthyear');
          currentMemberAnswers.details[form.controlName] = moment(
            this.medicalOptionalForm.get(
              `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}`,
            ).value,
          ).format('YYYY-MM-DD');
        } else {
          currentMemberAnswers.details[form.controlName] = this.medicalOptionalForm.get(
            `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}`,
          ).value;
        }
      });
    }
    // console.log('insuredDetails', this.insuredData);
    this.loaderService.showSpinner(true);
    this.proposalService.saveApplication(this.insuredData).subscribe(
      () => {
        this.loaderService.showSpinner(false);
        if (allValid) {
          this.medicalOptionalForm
            .get(`member-${this.memberId}-question-${this.currentQuestion?.questionId}-allFilled`)
            .setValue(true);
        } else {
          this.medicalOptionalForm
            .get(`member-${this.memberId}-question-${this.currentQuestion?.questionId}-allFilled`)
            .setValue(false);
        }
        this.dialogRef.close();
      },
      () => {
        this.loaderService.showSpinner(false);
      },
    );
  }
}
