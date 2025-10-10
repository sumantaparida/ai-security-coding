import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CustomerSearchModelComponent } from './customer-search-model.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddLoanDetailsComponent } from '../add-loan-details/add-loan-details.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

fdescribe('CustomerSearchModelComponent', () => {
    let component: CustomerSearchModelComponent;
    let fixture: ComponentFixture<CustomerSearchModelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                ReactiveFormsModule,
                MatDialogModule

            ],
            declarations: [CustomerSearchModelComponent, AddLoanDetailsComponent],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: {}
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomerSearchModelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should display the selected customer', () => {
        const customer = [{ id: 1, value: 'Sunjith' }];
        const customerSelectedSpy = true;
        component.onCustomerSelected(customer);
        expect(component.customer).toBe(customer);
        expect(component.customerSelected).toBe(true);
        expect(customerSelectedSpy).toBe(true);
    });


});
