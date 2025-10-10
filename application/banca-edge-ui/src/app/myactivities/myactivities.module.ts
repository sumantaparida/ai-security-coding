import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyActivitiesRoutingModule } from './myactivities-routing.module';
import { MyactivitiesComponent } from './myactivities.component';

@NgModule({
    declarations: [
        MyactivitiesComponent
    ],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,

        MyActivitiesRoutingModule,
        SharedModule,
        MatFormFieldModule,
        MatTableModule,
        ReactiveFormsModule,
        MatSortModule,
        MatInputModule,
        MatIconModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ]
})
export class MyActivitiesModule { }


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
