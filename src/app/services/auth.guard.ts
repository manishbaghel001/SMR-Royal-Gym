import { Injectable } from '@angular/core';
import {
    Router
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})

export class AuthGuard {
    constructor(private authService: AuthService, private router: Router) { }

    async canActivate(): Promise<boolean | any> {
        this.authService.getUserdata().then((user) => {
            if (user) {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        })
    }
}
