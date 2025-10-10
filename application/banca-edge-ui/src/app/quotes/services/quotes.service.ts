import { Injectable } from '@angular/core';


import { BehaviorSubject, interval, Observable, Subject, Subscription, timer } from 'rxjs';



@Injectable()

export class QuotesService {
    private quoteMemberSelected = new BehaviorSubject("")
    memberSelected = this.quoteMemberSelected.asObservable();

    constructor() { }

    selectedmembers(quoteMemberSelected) {
        this.quoteMemberSelected.next(quoteMemberSelected);
    }

}