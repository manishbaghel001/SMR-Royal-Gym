import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NetworkStatusService {
    private onlineStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(navigator.onLine);

    constructor(private ngZone: NgZone) {
        window.addEventListener('online', () => this.updateOnlineStatus(true));
        window.addEventListener('offline', () => this.updateOnlineStatus(false));
    }

    private updateOnlineStatus(isOnline: boolean): void {
        this.ngZone.run(() => {
            this.onlineStatus.next(isOnline);
        });
    }

    get isOnline(): Observable<boolean> {
        return this.onlineStatus.asObservable();
    }
}
