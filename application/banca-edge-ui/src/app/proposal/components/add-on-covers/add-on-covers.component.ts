import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProposalService } from '@app/proposal/services/proposal.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-add-on-covers',
  templateUrl: './add-on-covers.component.html',
  styleUrls: ['./add-on-covers.component.css'],
})
export class AddOnCoversComponent implements OnInit, OnChanges {
  @Input() covers;

  @Input() addOnForm: FormGroup;

  @Input() illustrationLink: string;

  @Input() fnaLink: string;

  @Input() insuredData;

  @Input() insuredAge;

  @Input() errorFromCovers;

  @Output() recalculatePremiumClicked = new EventEmitter();

  capturePan = false;

  disableAll = false;

  constructor(
    private proposalService: ProposalService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    if (this.insuredData.statusCode >= 4) {
      this.disableAll = true;
    }
    this.covers.forEach((cover, index) => {
      if (cover.saRequired) {
        this.addOnForm.addControl(cover.coverId + 'sumInsured', new FormControl(cover.sa));
        this.addOnForm.get(cover.coverId + 'sumInsured').valueChanges.subscribe((data) => {
          if (this.covers[index].selected && data > 0) {
            this.addOnForm.addControl('recalculate', new FormControl('', Validators.required));
            this.addOnForm.controls['recalculate'].updateValueAndValidity();
          } else if (!this.covers[index].selected && data === 0) {
            this.addOnForm.addControl('recalculate', new FormControl('', Validators.required));
            this.addOnForm.controls['recalculate'].updateValueAndValidity();
          }
        });
      }
    });
    if (!this.disableAll) {
      this.recalculatePremiumClicked.emit(true);
    }
  }

  ngOnChanges(changes) {
    if (this.illustrationLink) {
      this.addOnForm.addControl('viewIllustration', new FormControl('', Validators.required));
    } else {
      this.addOnForm.addControl('generateIllustration', new FormControl('', Validators.required));
    }

    if (
      changes.insuredData &&
      !changes.insuredData.firstChange &&
      changes.insuredData.currentValue.applicationData.proposer &&
      (changes.insuredData.currentValue.applicationData.proposer.panNo === '' ||
        changes.insuredData.currentValue.applicationData.proposer.panNo === undefined) &&
      changes.insuredData.currentValue.premiumAmount > 49999
    ) {
      this.capturePan = true;
      this.addOnForm.addControl(
        'proposerPan',
        new FormControl(this.insuredData.applicationData.proposer.panNo, Validators.required),
      );
    } else {
      this.capturePan = false;
      this.addOnForm.removeControl('proposerPan');
    }
    // if (changes.covers) {
    //     this.covers.forEach((cover, index) => {
    //         if (!this.addOnForm.get(cover.coverId + 'sumInsured')) {
    //             this.addOnForm.addControl(cover.coverId + 'sumInsured', new FormControl(cover.sa));
    //             this.addOnForm.get(cover.coverId + 'sumInsured').valueChanges.subscribe(data => {
    //                 if (cover.selected && data > 0) {
    //                     this.addOnForm.addControl('recalculate', new FormControl('', Validators.required));
    //                     this.addOnForm.controls['recalculate'].updateValueAndValidity();
    //                 } else if (!this.covers[index].selected && data === 0) {
    //                     this.addOnForm.addControl('recalculate', new FormControl('', Validators.required));
    //                     this.addOnForm.controls['recalculate'].updateValueAndValidity();
    //                 }
    //             });
    //         }
    //     });
    // }
  }

  onAddCover(index) {
    this.covers[index].selected = true;
    const cover = this.covers[index];
    this.addOnForm.addControl('recalculate', new FormControl('', Validators.required));
    if (cover.saRequired) {
      const validators = [];
      if (cover.attribute && cover.attribute.maxSa) {
        validators.push(Validators.max(+cover.attribute.maxSa));
      } else {
        validators.push(Validators.max(this.insuredData?.applicationData?.sumInsured));
      }
      if (cover.attribute && cover.attribute.minSa) {
        validators.push(Validators.min(+cover.attribute.minSa));
      }
      validators.push(Validators.required);
      validators.push(Validators.pattern(/^[1-9][0-9]*0{3}$/));
      this.addOnForm.get(cover.coverId + 'sumInsured').setValidators(validators);

      this.addOnForm.get(cover.coverId + 'sumInsured').setValidators(validators);
      this.addOnForm.controls[cover.coverId + 'sumInsured'].updateValueAndValidity();
    } else if (cover.premium[this.insuredData.mode].premium > 0) {
      const netPremium = cover.premium[this.insuredData.mode].netPremium;
      const premium = cover.premium[this.insuredData.mode].premium;
      const gst = premium - netPremium;
      this.insuredData.basePremium += netPremium;
      this.insuredData.premiumAmount += premium;
      this.insuredData.gst += gst;
    }
  }

  onPanChange() {
    this.insuredData.applicationData.proposer.panNo = this.addOnForm.get('proposerPan').value;
  }

  onRemoveCover(index) {
    this.covers[index].selected = false;
    const cover = this.covers[index];
    cover.sa = 0;
    this.addOnForm.addControl('recalculate', new FormControl('', Validators.required));
    if (cover.saRequired) {
      this.addOnForm.get(cover.coverId + 'sumInsured').clearValidators();
      this.addOnForm.get(cover.coverId + 'sumInsured').setValue(0);
      this.addOnForm.controls[cover.coverId + 'sumInsured'].updateValueAndValidity();
    } else if (cover.premium[this.insuredData.mode].premium > 0) {
      const netPremium = cover.premium[this.insuredData.mode].netPremium;
      const premium = cover.premium[this.insuredData.mode].premium;
      const gst = premium - netPremium;
      this.insuredData.basePremium -= netPremium;
      this.insuredData.premiumAmount -= premium;
      this.insuredData.gst -= gst;
    }
  }

  onSumInsuredChanged(event, index) {
    this.covers[index].sa = +event.target.value;
  }

  onRecalculateClicked() {
    console.log('working fine till here recalcute');
    this.recalculatePremiumClicked.emit(true);
    this.addOnForm.removeControl('recalculate');
    this.addOnForm.get('viewIllustration').setValidators(Validators.required);
    this.addOnForm.get('viewIllustration').updateValueAndValidity();
  }

  onViewIllustrationClicked() {
    if (!this.errorFromCovers) {
      this.addOnForm.get('viewIllustration').setValidators([]);
      this.addOnForm.removeControl('generateIllustration');
      this.addOnForm.get('viewIllustration').updateValueAndValidity();
    }
  }

  onGenerateIllustration() {
    this.recalculatePremiumClicked.emit(true);
    this.addOnForm.get('generateIllustration').setValidators([]);
    this.addOnForm.get('generateIllustration').updateValueAndValidity();
  }

  base64ToPdf() {
    this.loaderService.showSpinner(true);
    this.proposalService.getFnaBase64(this.insuredData.applicationNo).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        const byte64Data = data['base64Pdf'];
        const byteArray = new Uint8Array(
          atob(byte64Data)
            .split('')
            .map((char) => char.charCodeAt(0)),
        );
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        // Here is your URL you can use
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const message = error.responseMessage;
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }
}
