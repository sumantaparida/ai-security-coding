import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

    @Input() applicationDetails;
    @Input() sendLeadToInsurerData;

    consturctor() { }

    ngOnInit() { }
}
