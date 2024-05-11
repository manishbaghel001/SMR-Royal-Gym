
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CacheService {

    setData(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getData(key: string): any {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    removeData(key: string): any {
        localStorage.removeItem(key);
    }

}