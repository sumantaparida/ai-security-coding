import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
    // isLoading;

    public loadingSpinner = new BehaviorSubject<boolean>(false);

    showSpinner(value: boolean) {
        // this.isLoading = value;
        this.loadingSpinner.next(value);
    }
}
