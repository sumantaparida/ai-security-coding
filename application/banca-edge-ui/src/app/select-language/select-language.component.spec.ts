import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { SelectLanguageComponent } from './select-language.component';
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { translateLoaderFactory } from "@app/i18n/i18n.module";

describe('SelectLanguageComponent', () => {
  let component: SelectLanguageComponent;
  let fixture: ComponentFixture<SelectLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectLanguageComponent],
      imports: [
        TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
            useFactory: translateLoaderFactory,
          deps: [HttpClient]
        }
        }),
        HttpClientTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
