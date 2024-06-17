import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, catchError, finalize, from, throwError } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private authService: AuthService, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

    getImageUrl(path: string) {
        return this.storage.ref(path).getDownloadURL()
    }

    removeImage(path: string): Observable<any> {
        return from(this.storage.ref(path).delete())
            .pipe(
                catchError((error) => {
                    {
                        alert('An error occurred while removing the image. Please try again.');
                    }
                    return throwError(error);
                }),
                finalize(() => "Image Removed")
            )
    }

    uploadImage(imageFile: File, path: string): Observable<string> {
        const uploadTask = this.storage.ref(path).put(imageFile);
        const statusSubject = new Subject<string>();

        uploadTask.snapshotChanges().pipe(
            finalize(async () => {
                try {
                    this.storage.ref(path).getDownloadURL()
                    statusSubject.next('completed');
                    statusSubject.complete();
                } catch (error) {
                    statusSubject.error('Failed to get download URL');
                }
            })
        ).subscribe(
            snapshot => {
                if (snapshot.bytesTransferred === snapshot.totalBytes && snapshot.totalBytes > 0) {
                    console.log('Upload is 100% done');
                }
            },
            error => {
                statusSubject.error('Upload failed');
            }
        )

        return statusSubject.asObservable();
    }

    setData(uid: string, data: any): Observable<any> {
        this.authService.setLoaderValue(true)
        return from(this.firestore.collection('users').doc(uid).set(data, { merge: true }))
            .pipe(
                catchError((error) => {
                    {
                        alert('An error occurred while setting the imadatage. Please try again.');
                    }
                    return throwError(error);
                }),
                finalize(() => "Data Seted")
            )

    }

    getData(): Observable<any> {
        return from(this.firestore.collection('users').valueChanges())
            .pipe(
                catchError((error) => {
                    {
                        alert('An error occurred while fetching the data. Please try again.');
                    }
                    return throwError(error);
                }),
                finalize(() => "Data Fetched")
            )
    }

    getDataById(uid: string): Observable<any> {
        return from(this.firestore.collection('users').doc(uid).get())
            .pipe(
                catchError((error) => {
                    alert('An error occurred while fetching the user data. Please try again.');
                    return throwError(error);
                }),
                finalize(() => console.log("User Data Fetched"))
            );
    }

    deleteData(uid: string): Observable<any> {
        return from(this.firestore.collection('users').doc(uid).delete())
            .pipe(
                catchError((error) => {
                    {
                        alert('An error occurred while deleting the data. Please try again.');
                    }
                    return throwError(error);
                }),
                finalize(() => "Data Deleted")
            )
    }
}