import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';



@Injectable({
    providedIn: 'root'
})

export class UwService {

    constructor(private http: HttpClient) { }

    getUwPolicy() {
        return this.http.get(`${environment.apiUrl}/api/v1/policy/getPoliciesForUW`);
    }

    getUwDecission() {
        return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCodes/UWCodes/BNCEDGE`);
    }

    addNotes(addNotes) {
        return this.http.post(`${environment.apiUrl}/api/v1/underwriting/addNotes`, addNotes);
    }

    getNotes(appNo) {
        return this.http.get(`${environment.apiUrl}/api/v1/underwriting/getNotesforApplication/${appNo}`);
    }

    getSaveDecision() {
        return this.http.get(`${environment.apiUrl}/api/v1/master/ underwriting /saveDecision`);
    }

    getApplicationDetails(appNo) {
        return this.http.get(`${environment.apiUrl}/api/v1/policy/getApplicationbyApplicationNo/${appNo}`);
    }

    saveDecision(decission) {
        return this.http.post(`${environment.apiUrl}/api/v1/underwriting/saveDecision`, decission);
    }
}
