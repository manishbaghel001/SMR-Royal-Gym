import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, finalize } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

    getImageUrl(path: string) {
        return this.storage.ref(path).getDownloadURL();
    }

    removeImage(path: string) {
        return this.storage.ref(path).delete();
    }

    uploadImage(imageFile: File, path: string): Observable<string> {
        const uploadTask = this.storage.ref(path).put(imageFile);
        const statusSubject = new Subject<string>();

        uploadTask.snapshotChanges().pipe(
            finalize(async () => {
                try {
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

    setData(uid: string, data: any) {
        this.firestore.collection('users').doc(uid).set(data, { merge: true })
            .catch(error => console.error(error));
    }

    getData() {
        return this.firestore.collection('users').valueChanges()
    }

    deleteData(uid: string) {
        this.firestore.collection('users').doc(uid).delete()
            .catch(error => console.error(error));
    }
}