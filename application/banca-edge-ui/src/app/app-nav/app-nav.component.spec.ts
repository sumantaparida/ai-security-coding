import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AppNavComponent } from './app-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';


describe('AppNavComponent', () => {
  let component: AppNavComponent;
  let fixture: ComponentFixture<AppNavComponent>;


  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [AppNavComponent],
      imports: [
        // TranslateTestingModule.withTranslations({
        //   English: require('assets/i18n/trans.English.json'),
        //   मराठी: require('assets/i18n/trans.मराठी.json'),
        //   ಕನ್ನಡ: require('assets/i18n/trans.ಕನ್ನಡ.json'),
        // }),
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatMenuModule,
      ]

    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
