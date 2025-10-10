import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProposalService } from '@app/proposal/services/proposal.service';
import { LoaderService } from '@app/_services/loader.service';
import moment from 'moment';

@Component({
  selector: 'app-covid-negative-follow-up-form',
  templateUrl: './covid-negative-follow-up-form.component.html',
  styleUrls: ['./covid-negative-follow-up-form.component.css'],
})
export class CovidNegativeFollowUpFormComponent implements OnInit {
  medicalOptionalForm: FormGroup;

  memberId: number;

  currentQuestion;

  insuredData;

  insurers;

  answers;

  today = new Date();

  year;

  constructor(
    private dialogRef: MatDialogRef<CovidNegativeFollowUpFormComponent>,
    private proposalService: ProposalService,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit(): void {
    this.medicalOptionalForm = this.data.form;
    this.memberId = this.data.memberId;
    this.currentQuestion = this.data.question;
    this.insurers = this.data.insurers;
    this.answers = this.data.answers;
    this.insuredData = this.data.insuredData;
    if (this.currentQuestion.questionId === 'covid-16') {
      const tempDependentquestion = {
        controlName: 'postvaccreactdesc',
        controlType: 'text',
        initiallyDisabled: false,
        isLoadedFromMaster: false,
        label:
          'Please share details including treatment taken for the same and date of complete recovery',
        masterValue: '',
        options: [],
        validators: { required: true },
        valueType: 'covidvaccinated',
      };
      const currentDependentvalue = this.medicalOptionalForm.get(
        `member-${this.memberId}-question-covid-16-postvaccreact`,
      ).value;
      if (currentDependentvalue === 'Y') {
        if (
          this.currentQuestion.formData.findIndex(
            (questionD) => questionD.controlName === 'postvaccreactdesc',
          ) === -1
        ) {
          const position = this.currentQuestion.formData.findIndex(
            (questionD) => questionD.controlName === 'postvaccreact',
          );
          this.currentQuestion.formData.splice(position + 1, 0, tempDependentquestion);
          const reqanswer = this.answers.find((answer) => {
            return answer.questionId === 'covid-16';
          });
          const reqmemanswer = reqanswer.answerDetails.find((memanswer) => {
            return memanswer.memberId === this.memberId;
          });
          const reqval = reqmemanswer.details.postvaccreactdesc;
          this.medicalOptionalForm.addControl(
            `member-${this.memberId}-question-covid-16-postvaccreactdesc`,
            new FormControl(reqval, Validators.required),
          );
        }
      } else if (
        currentDependentvalue === 'N' ||
        currentDependentvalue === null ||
        currentDependentvalue === undefined
      ) {
        if (
          this.currentQuestion.formData.findIndex(
            (questionD) => questionD.controlName === 'postvaccreactdesc',
          ) > -1
        ) {
          const index = this.currentQuestion.formData.findIndex(
            (questionD) => questionD.controlName === 'postvaccreactdesc',
          );
          this.currentQuestion.formData.splice(index, 1);
          this.medicalOptionalForm.removeControl(
            `member-${this.memberId}-question-covid-16-postvaccreactdesc`,
          );
        }
      }
      this.medicalOptionalForm
        .get(`member-${this.memberId}-question-covid-16-postvaccreact`)
        .valueChanges.subscribe((value) => {
          if (value === 'Y') {
            if (
              this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'postvaccreactdesc',
              ) === -1
            ) {
              const position = this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'postvaccreact',
              );
              this.currentQuestion.formData.splice(position + 1, 0, tempDependentquestion);
              this.medicalOptionalForm.addControl(
                `member-${this.memberId}-question-covid-16-postvaccreactdesc`,
                new FormControl('', Validators.required),
              );
            }
          } else if (value === 'N' || value === null || value === undefined) {
            if (
              this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'postvaccreactdesc',
              ) > -1
            ) {
              const index = this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'postvaccreactdesc',
              );
              this.currentQuestion.formData.splice(index, 1);
              this.medicalOptionalForm.removeControl(
                `member-${this.memberId}-question-covid-16-postvaccreactdesc`,
              );
            }
          }
        });
    }
    if (this.currentQuestion.questionId === 'covid-18') {
      const tempDependentquestion = {
        controlName: 'ventilatorsupportdesc',
        controlType: 'text',
        initiallyDisabled: false,
        isLoadedFromMaster: false,
        label: 'Description',
        masterValue: '',
        options: [],
        validators: { required: true },
        valueType: 'intensivecare',
      };
      const tempDependentquestion1 = {
        controlName: 'pendingDiagnosisdesc',
        controlType: 'text',
        initiallyDisabled: false,
        isLoadedFromMaster: false,
        label: 'Description',
        masterValue: '',
        options: [],
        validators: { required: true },
        valueType: 'intensivecare',
      };
      this.currentQuestion.formData.forEach((question) => {
        if (question.controlName === 'ventilatorsupport') {
          const currentDependentvalue = this.medicalOptionalForm.get(
            `member-${this.memberId}-question-covid-18-ventilatorsupport`,
          ).value;
          if (currentDependentvalue === 'Y') {
            if (
              this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'ventilatorsupportdesc',
              ) === -1
            ) {
              const position = this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'ventilatorsupport',
              );
              this.currentQuestion.formData.splice(position + 1, 0, tempDependentquestion);
              const reqanswer = this.answers.find((answer) => {
                return answer.questionId === 'covid-18';
              });
              const reqmemanswer = reqanswer.answerDetails.find((memanswer) => {
                return memanswer.memberId === this.memberId;
              });
              const reqval = reqmemanswer.details.ventilatorsupportdesc;
              this.medicalOptionalForm.addControl(
                `member-${this.memberId}-question-covid-18-ventilatorsupportdesc`,
                new FormControl(reqval, Validators.required),
              );
            }
          } else if (
            currentDependentvalue === 'N' ||
            currentDependentvalue === null ||
            currentDependentvalue === undefined
          ) {
            if (
              this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'ventilatorsupportdesc',
              ) > -1
            ) {
              const index = this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'ventilatorsupportdesc',
              );
              this.currentQuestion.formData.splice(index, 1);
              this.medicalOptionalForm.removeControl(
                `member-${this.memberId}-question-covid-18-ventilatorsupportdesc`,
              );
            }
          }
          this.medicalOptionalForm
            .get(`member-${this.memberId}-question-covid-18-ventilatorsupport`)
            .valueChanges.subscribe((value) => {
              if (value === 'Y') {
                if (
                  this.currentQuestion.formData.findIndex(
                    (questionD) => questionD.controlName === 'ventilatorsupportdesc',
                  ) === -1
                ) {
                  const position = this.currentQuestion.formData.findIndex(
                    (questionD) => questionD.controlName === 'ventilatorsupport',
                  );
                  this.currentQuestion.formData.splice(position + 1, 0, tempDependentquestion);

                  this.medicalOptionalForm.addControl(
                    `member-${this.memberId}-question-covid-18-ventilatorsupportdesc`,
                    new FormControl('', Validators.required),
                  );
                }
              } else if (value === 'N' || value === null || value === undefined) {
                if (
                  this.currentQuestion.formData.findIndex(
                    (questionD) => questionD.controlName === 'ventilatorsupportdesc',
                  ) > -1
                ) {
                  const index = this.currentQuestion.formData.findIndex(
                    (questionD) => questionD.controlName === 'ventilatorsupportdesc',
                  );
                  this.currentQuestion.formData.splice(index, 1);
                  this.medicalOptionalForm.removeControl(
                    `member-${this.memberId}-question-covid-18-ventilatorsupportdesc`,
                  );
                }
              }
            });
        } else if (question.controlName === 'pendingDiagnosis') {
          const currentDependentvalue = this.medicalOptionalForm.get(
            `member-${this.memberId}-question-covid-18-pendingDiagnosis`,
          ).value;
          if (currentDependentvalue === 'Y') {
            if (
              this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'pendingDiagnosisdesc',
              ) === -1
            ) {
              const position = this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'pendingDiagnosis',
              );
              this.currentQuestion.formData.splice(position + 1, 0, tempDependentquestion1);
              const reqanswer = this.answers.find((answer) => {
                return answer.questionId === 'covid-18';
              });
              const reqmemanswer = reqanswer.answerDetails.find((memanswer) => {
                return memanswer.memberId === this.memberId;
              });
              const reqval = reqmemanswer.details.pendingDiagnosisdesc;
              this.medicalOptionalForm.addControl(
                `member-${this.memberId}-question-covid-18-pendingDiagnosisdesc`,
                new FormControl(reqval, Validators.required),
              );
            }
          } else if (
            currentDependentvalue === 'N' ||
            currentDependentvalue === null ||
            currentDependentvalue === undefined
          ) {
            if (
              this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'pendingDiagnosisdesc',
              ) > -1
            ) {
              const index = this.currentQuestion.formData.findIndex(
                (questionD) => questionD.controlName === 'pendingDiagnosisdesc',
              );
              this.currentQuestion.formData.splice(index, 1);
              this.medicalOptionalForm.removeControl(
                `member-${this.memberId}-question-covid-18-pendingDiagnosisdesc`,
              );
            }
          }
          this.medicalOptionalForm
            .get(`member-${this.memberId}-question-covid-18-pendingDiagnosis`)
            .valueChanges.subscribe((value) => {
              if (value === 'Y') {
                if (
                  this.currentQuestion.formData.findIndex(
                    (questionD) => questionD.controlName === 'pendingDiagnosisdesc',
                  ) === -1
                ) {
                  const position = this.currentQuestion.formData.findIndex(
                    (questionD) => questionD.controlName === 'pendingDiagnosis',
                  );
                  this.currentQuestion.formData.splice(position + 1, 0, tempDependentquestion1);
                  this.medicalOptionalForm.addControl(
                    `member-${this.memberId}-question-covid-18-pendingDiagnosisdesc`,
                    new FormControl('', Validators.required),
                  );
                }
              } else if (value === 'N' || value === null || value === undefined) {
                if (
                  this.currentQuestion.formData.findIndex(
                    (questionD) => questionD.controlName === 'pendingDiagnosisdesc',
                  ) > -1
                ) {
                  const index = this.currentQuestion.formData.findIndex(
                    (questionD) => questionD.controlName === 'pendingDiagnosisdesc',
                  );
                  this.currentQuestion.formData.splice(index, 1);
                  this.medicalOptionalForm.removeControl(
                    `member-${this.memberId}-question-covid-18-pendingDiagnosisdesc`,
                  );
                }
              }
            });
        }
      });
    }
  }

  onDataChanged(controlName, valueType, event) {
    console.log(controlName, valueType, event);
  }

  onSelectionChanged(controlName, valueType, event) {
    console.log(controlName, valueType, event);
  }

  onDateChanged(controlName, valueType, event) {
    console.log(controlName, valueType, event);
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
