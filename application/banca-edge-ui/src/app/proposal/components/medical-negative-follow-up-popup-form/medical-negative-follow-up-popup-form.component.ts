import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProposalService } from '@app/proposal/services/proposal.service';
import { maxvalueVal } from '@app/shared/validators/maxValue.validator';
import { LoaderService } from '@app/_services/loader.service';
import moment from 'moment';
import { MedicalFormModalComponent } from '../medical-negative-follow-up-form/medical-form-modal.component';

@Component({
  selector: 'app-medical-negative-follow-up-popup-form',
  templateUrl: './medical-negative-follow-up-popup-form.component.html',
  styleUrls: ['./medical-negative-follow-up-popup-form.component.css'],
})
export class MedicalNegativeFollowUpPopupFormComponent implements OnInit {
  medicalOptionalForm: FormGroup;

  memberId: number;

  currentQuestion;

  insuredData;

  insurers;

  answers;

  answerCountIdex;

  addDisease: boolean;

  today = new Date();

  year;

  dialog: any;

  allValid;

  dataSource = [];

  addAns;

  displayedColumns;

  answerForCurrentQuestion;

  currentMemberAnswers;

  showError = false;

  quesValueType;

  policyQuestionsForm: any;

  constructor(
    private dialogRef: MatDialogRef<MedicalFormModalComponent>,
    private proposalService: ProposalService,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit() {
    this.addDisease = false;
    this.medicalOptionalForm = this.data.form;
    this.memberId = this.data.memberId;
    this.currentQuestion = this.data.question;
    this.insurers = this.data.insurers;
    this.answers = this.data.answers;
    this.insuredData = this.data.insuredData;
    this.quesValueType = this.currentQuestion.formData[0]?.valueType;
    // console.log('medicalOptionalForm', this.medicalOptionalForm);
    // console.log('memberId', this.memberId);
    // console.log('currentQuestion', this.currentQuestion);
    // console.log('insurers', this.insurers);
    // console.log('answers', this.answers);
    // console.log('insuredData', this.insuredData);
    this.displayedColumns = [
      'position',
      'name',
      'peddate',
      'treatment',
      'diagnosis',
      'hospitalName',
      'consultationDate',
      'action',
    ];
    this.fetchMasterData();
    this.findCurrentAnswer();
    // this.dataSource = [
    //   {
    //     position: 1,
    //     name: 'Hydrogen',
    //     peddate: '2022-02-16',
    //     treatment: 'H',
    //     diagnosis: 'excersice',
    //     hospitalName: 'kare vatika',
    //     consultationDate: '2022-02-16',
    //   },
    //   {
    //     position: 1,
    //     name: 'Hydrogen',
    //     peddate: '2022-02-16',
    //     treatment: 'H',
    //     diagnosis: 'excersice',
    //     hospitalName: 'kare vatika',
    //     consultationDate: '2022-02-16',
    //   },
    //   {
    //     position: 1,
    //     name: 'Hydrogen',
    //     peddate: '2022-02-16',
    //     treatment: 'H',
    //     diagnosis: 'excersice',
    //     hospitalName: 'kare vatika',
    //     consultationDate: '2022-02-16',
    //   },
    //   {
    //     position: 1,
    //     name: 'Hydrogen',
    //     peddate: '2022-02-16',
    //     treatment: 'H',
    //     diagnosis: 'excersice',
    //     hospitalName: 'kare vatika',
    //     consultationDate: '2022-02-16',
    //   },
    //   {
    //     position: 1,
    //     name: 'Hydrogen',
    //     peddate: '2022-02-16',
    //     treatment: 'H',
    //     diagnosis: 'excersice',
    //     hospitalName: 'kare vatika',
    //     consultationDate: '2022-02-16',
    //   },
    // ];
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

  fetchMasterData() {
    this.currentQuestion.formData.forEach((form) => {
      if (form.isLoadedFromMaster) {
        this.proposalService
          .getDropdownFromMaster(form.masterValue, this.insuredData.productId)
          .subscribe((val) => {
            form['options'] = val;
          });
      }
    });
  }

  findCurrentAnswer() {
    this.dataSource = [];
    this.answerForCurrentQuestion = this.answers.find(
      (answer) => answer.questionId === this.currentQuestion.questionId,
    );
    if (
      this.answerForCurrentQuestion.answerDetails &&
      this.answerForCurrentQuestion.answerDetails.length > 0
    ) {
      this.currentMemberAnswers = this.answerForCurrentQuestion.answerDetails.find(
        (memberAnswer) => memberAnswer.memberId === this.memberId,
      );

      this.currentMemberAnswers.details.forEach((detail, index) => {
        const optionform = this.currentQuestion.formData.find((form) => {
          if (form.isLoadedFromMaster) {
            return detail.hasOwnProperty(form.controlName);
          }
        });
        // console.log(optionform);
        const optionValue = optionform.options;
        this.dataSource.push({
          position: index,
          name: optionValue.find((value) => {
            return value.id === detail.diseaseName;
          }).value,
          peddate: detail.sufferingFrom,
          treatment: detail.treatmentTaken,
          diagnosis: detail.exactDiagnosis,
          hospitalName: detail.hospitalName,
          consultationDate: detail.consultaionDate,
        });
      });
    }
  }

  onAddDisease() {
    if (
      this.answerForCurrentQuestion.answerDetails &&
      this.answerForCurrentQuestion.answerDetails.length > 0
    ) {
      this.answerCountIdex = this.currentMemberAnswers.details.length;
      if (this.currentMemberAnswers.details.length === 0) {
        this.currentMemberAnswers.details = [];
      }
      this.currentMemberAnswers.details.push({});
      this.addDisease = true;
      // console.log('printing current answer', this.currentMemberAnswers.details.length);
      this.currentQuestion.formData.forEach((form) => {
        const validators = this.getValidatorsArray(form);
        this.medicalOptionalForm.addControl(
          `member-${this.currentMemberAnswers.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}-${this.answerCountIdex}`,
          new FormControl(
            this.currentMemberAnswers.details[this.answerCountIdex][form.controlName],
            validators,
          ),
        );
      });
    }
  }

  onSaveClicked() {
    // console.log('insuredDetails', this.insuredData);
    this.loaderService.showSpinner(true);
    this.proposalService.saveApplication(this.insuredData).subscribe(
      () => {
        this.loaderService.showSpinner(false);
        if (this.allValid) {
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

  addOnDisease(index) {
    this.allValid = true;
    if (
      this.answerForCurrentQuestion.answerDetails &&
      this.answerForCurrentQuestion.answerDetails.length > 0
    ) {
      const detailStructure = {};
      this.currentQuestion.formData.forEach((form) => {
        if (
          !this.medicalOptionalForm.get(
            `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}-${index}`,
          ).valid
        ) {
          this.allValid = false;
        }
        if (form.controlType === 'date') {
          // console.log(this.medicalOptionalForm);
          detailStructure[form.controlName] =
            this.medicalOptionalForm.get(
              `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}-${index}`,
            ).value === null
              ? ''
              : moment(
                  this.medicalOptionalForm.get(
                    `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}-${index}`,
                  ).value,
                ).format('YYYY-MM-DD');
        } else if (form.controlType === 'datemonthyear') {
          detailStructure[form.controlName] =
            this.medicalOptionalForm.get(
              `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}-${index}`,
            ).value === null
              ? ''
              : moment(
                  this.medicalOptionalForm.get(
                    `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}-${index}`,
                  ).value,
                ).format('YYYY-MM-DD');
        } else {
          detailStructure[form.controlName] = this.medicalOptionalForm.get(
            `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}-${index}`,
          ).value;
        }
      });
      this.addDisease = this.checkAnswerValidation(index);
      if (this.addDisease) {
        this.showError = true;
      } else {
        // console.log(detailStructure);
        this.currentMemberAnswers.details.splice(index, 1, detailStructure);
        this.showError = false;
        this.findCurrentAnswer();
      }
    }
  }

  onDelete(index) {
    this.currentMemberAnswers.details.splice(index.position, 1);
    this.dataSource.splice(index.position, 1);
    this.currentQuestion.formData.forEach((form) => {
      Object.keys(this.medicalOptionalForm.controls).forEach((control) => {
        if (
          control.indexOf(
            `member-${this.currentMemberAnswers.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}`,
          ) > -1
        ) {
          this.medicalOptionalForm.removeControl(control);
        }
      });
    });
    this.recreateFormControl();
    // console.log('check all', this.currentMemberAnswers, this.medicalOptionalForm, this.dataSource);
    this.findCurrentAnswer();
    this.addDisease = false;
  }

  onEdit(index) {
    this.addDisease = true;
    this.answerCountIdex = index.position;
  }

  recreateFormControl() {
    this.currentMemberAnswers.details.forEach((detail, index) => {
      this.currentQuestion.formData.forEach((form) => {
        const validators = this.getValidatorsArray(form);
        this.medicalOptionalForm.addControl(
          `member-${this.currentMemberAnswers.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}-${index}`,
          new FormControl(this.currentMemberAnswers.details[index][form.controlName], validators),
        );
      });
    });
  }

  checkAnswerValidation(index) {
    let allAnsValid;
    this.currentQuestion.formData.forEach((form) => {
      if (Object.keys(form.validators).length > 0) {
        if (
          this.medicalOptionalForm.get(
            `member-${this.memberId}-question-${this.currentQuestion.questionId}-${form.controlName}-${index}`,
          ).valid
        ) {
          allAnsValid = false;
        } else {
          allAnsValid = true;
          return allAnsValid;
        }
      }
    });
    return allAnsValid;
  }

  getValidatorsArray(formData): any[] {
    const validatorsArray = [];
    Object.keys(formData.validators).forEach((validatorKey) => {
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
      } else if (validatorKey === 'maxValue') {
        validatorsArray.push(maxvalueVal(formData.validators[validatorKey]));
      }
    });
    return validatorsArray;
  }
}
