import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MycustomersComponent } from './mycustomers.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('MycustomersComponent', () => {
  let component: MycustomersComponent;
  let fixture: ComponentFixture<MycustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MycustomersComponent],
      imports: [HttpClientTestingModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule, NoopAnimationsModule,
        // TranslateTestingModule.withTranslations({
        //   English: require('assets/i18n/trans.English.json'),
        //   मराठी: require('assets/i18n/trans.मराठी.json'),
        //   ಕನ್ನಡ: require('assets/i18n/trans.ಕನ್ನಡ.json'),
        // })
      ],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
