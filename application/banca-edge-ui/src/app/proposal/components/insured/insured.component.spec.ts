import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredComponent } from './insured.component';

fdescribe('InsuredComponent', () => {
    let component: InsuredComponent;
    let fixture: ComponentFixture<InsuredComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InsuredComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InsuredComponent);
        component = fixture.componentInstance;
        component.insuredDetails = [{
            dob: '2003-03-04',
            firstName: 'John',
            gender: 'M',
            heightFeet: 5,
            heightInches: 5,
            identityNo: '',
            identityType: '',
            lastName: 'Doe',
            maritalStatus: 'M',
            nationality: '',
            nominee: {
                benefitPercent: 100,
            },
            occupation: 'ACC',
            proposerRel: '1',
            rating: 'S',
            title: 'MR',
            weight: 66,
        }, {
            dob: '1978-07-25',
            firstName: 'Sarah',
            gender: 'F',
            heightFeet: 5,
            heightInches: 3,
            identityNo: '',
            identityType: '',
            lastName: 'Williams',
            maritalStatus: 'M',
            nationality: '',
            nominee: {
                benefitPercent: 100,
            },
            occupation: 'ACC',
            proposerRel: '2',
            rating: 'NS',
            title: 'MS',
            weight: 60,
        }];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
