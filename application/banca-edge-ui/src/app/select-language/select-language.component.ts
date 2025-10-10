import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.css'],

  // `
  //   <select #langSelect (change)="translate.use(langSelect.value)">
  //     <option
  //       *ngFor="let lang of translate.getLangs()"
  //       [value]="lang"
  //       [attr.selected]="lang === translate.currentLang ? '' : null"
  //     >
  //     <span *ngIf="lang==='en'">English</span>
  //     <span *ngIf="lang==='marati'">मराठी</span>
  //     <span *ngIf="lang==='kannada'">ಕನ್ನಡ</span>
  //     <span *ngIf="lang==='hindi'">हिन्दी</span>
  //     </option>
  //   </select>
  // `,
})
export class SelectLanguageComponent implements OnInit {
  getLanguages;
  displayLang = 'English';
  constructor(public translate: TranslateService) {
  }
  ngOnInit() {
    this.getLanguages = this.translate.getLangs();

  }
  selectLang(value) {
    this.translate.use(value);
    if (value === 'en') {
      this.displayLang = 'English';
    } else if (value === 'marati') {
      this.displayLang = 'मराठी';
    } else if (value === 'kannada') {
      this.displayLang = 'ಕನ್ನಡ';
    } else if (value === 'hindi') {
      this.displayLang = 'हिन्दी';
    }

  }
}
