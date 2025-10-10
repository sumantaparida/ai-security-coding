import { NgModule, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [TranslateModule]
})

@Injectable({
  providedIn: 'root',
})
export class I18nModule {
  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'marati', 'kannada', 'hindi']);
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|marati|kannada|hindi/) ? browserLang : 'en');
  }
}

export function translateLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "../assets/i18n/trans.", ".json");
}
