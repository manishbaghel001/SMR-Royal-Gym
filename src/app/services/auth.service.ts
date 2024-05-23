import { EventEmitter, Injectable, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { BehaviorSubject, Observable, Subscription, catchError, finalize, from, throwError } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})

export class AuthService {

    private userSubject = new BehaviorSubject<User | null>(null);
    user = this.userSubject.asObservable();
    @Output() valueEmitter = new EventEmitter<string>();
    private inputValueSubject = new BehaviorSubject<boolean>(false);
    authState: Subscription;
    state: Subscription;
    constructor(private afAuth: AngularFireAuth, private router: Router) {
        this.authState = this.afAuth.authState.subscribe(user => {
            this.userSubject.next(user);
        });
    }

    ngOnDestroy() {
        if (this.authState) {
            this.authState.unsubscribe();
        }
        if (this.state) {
            this.state.unsubscribe();
        }
    }

    setLoaderValue(value: boolean) {
        this.inputValueSubject.next(value);
    }

    isUserLoggedIn(): boolean {
        return !!this.user; // Return true if user is not null or undefined
    }

    getUser(): Observable<any> {
        return this.user;
    }

    getLoaderValue() {
        return this.inputValueSubject.asObservable();
    }

    signIn(email: string, password: string): Observable<any> {
        this.setLoaderValue(true);
        return from(this.afAuth.signInWithEmailAndPassword(email, password))
            .pipe(
                catchError((error) => {
                    {
                        this.setLoaderValue(false);
                        alert(error.message);
                        this.router.navigate(['/login'])
                    }
                    return throwError(error);
                }),
                finalize(() => {
                    this.setLoaderValue(false);
                    this.router.navigate(['/admin'])
                }
                )
            )
    }

    logout(): Observable<any> {
        this.setLoaderValue(true);
        return from(this.afAuth.signOut())
            .pipe(
                catchError((error) => {
                    {
                        this.setLoaderValue(false);
                        alert(error.message);
                    }
                    return throwError(error);
                }),
                finalize(() => {
                    this.setLoaderValue(false);
                    this.router.navigate(['/login'])
                }
                )
            )
    }

    async forgotPassword(email: string): Promise<any> {
        this.setLoaderValue(true);
        return new Promise<any>((resolve, reject) => {
            this.afAuth.sendPasswordResetEmail(email).then(user => {
                this.setLoaderValue(false);
                resolve(user);
            }).catch(error => {
                this.setLoaderValue(false);
                alert('Invalid email format')
                reject(error);
            });
        });
    }

    async getUserdata(): Promise<any> {
        this.setLoaderValue(true);
        return new Promise<any>((resolve, reject) => {
            this.state = this.afAuth.authState.subscribe(user => {
                if (user) {
                    user.updateProfile({
                        displayName: user.displayName,
                    }).then(() => {
                        this.setLoaderValue(false);
                        resolve(user);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    this.setLoaderValue(false);
                    this.router.navigate(['/login']);
                    resolve(null);
                }
            });
        });
    }

}
