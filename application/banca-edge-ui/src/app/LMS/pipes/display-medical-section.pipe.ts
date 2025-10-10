import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'displayMedicalSection'
})
export class DisplayMedicalSectionPipe implements PipeTransform {

  transform(section, insurers: any[], answers: any[], formGroup: FormGroup): boolean {
    // console.log('section', section);
    // console.log('insurers', insurers);
    // console.log('answers', answers);
    // console.log('formGroup', formGroup);

    if (section.onlyForFemaleInsurers) {
      const femaleInsurer = insurers.filter(insurer => insurer.gender === 'F');
      if (femaleInsurer.length > 0) {
        return true;
      } else {
        insurers.forEach(insurer => {
          section.formData.forEach(form => {
            const answerForCurrentQuestion = answers.find(answer => answer.questionId === form.questionId);
            answerForCurrentQuestion.answerDetails.forEach(answerDetail => {
              answerDetail.answer = form.positiveAnswer;
              Object.keys(answerDetail.details).forEach(detail => answerDetail.details[detail] = '');
            });
            // console.log('got the current answer', answerForCurrentQuestion);
            // console.log('printing each form', form);
            // console.log('questionId', form.questionId);
            formGroup.get(form.code).setValue(form.positiveAnswer);
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
