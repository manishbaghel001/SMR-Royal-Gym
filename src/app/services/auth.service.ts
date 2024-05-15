import { EventEmitter, Injectable, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GithubAuthProvider, User } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})

export class AuthService {

    private userSubject = new BehaviorSubject<User | null>(null);
    user = this.userSubject.asObservable();
    @Output() valueEmitter = new EventEmitter<string>();
    private inputValueSubject = new BehaviorSubject<boolean>(false);
    constructor(private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {
        this.afAuth.authState.subscribe(user => {
            this.userSubject.next(user);
        });
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

    signIn(email: string, password: string) {
        this.setLoaderValue(true);
        this.afAuth.signInWithEmailAndPassword(email, password).then((res) => {
            if (res.user) {
                this.setLoaderValue(false);
                this.router.navigate(['/admin'])
            }
        }, err => {
            alert(err.message);
            this.setLoaderValue(false);
            this.router.navigate(['/login'])
        });
    }

    // register(email, password) {
    //     this.setLoaderValue(true);
    //     this.afAuth.createUserWithEmailAndPassword(email, password).then((res) => {

    //     }, err => {
    //         this.setLoaderValue(false);
    //         alert(err.message);
    //     });
    // }

    logout() {
        this.setLoaderValue(true);
        this.afAuth.signOut().then(() => {
            this.setLoaderValue(false);
            this.router.navigate(['/login'])
        }, err => {
            this.setLoaderValue(false);
            alert(err.message);
        });
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
            this.afAuth.authState.subscribe(user => {
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
