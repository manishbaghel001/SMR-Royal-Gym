import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

    getImageUrl(path: string) {
        return this.storage.ref(path).getDownloadURL();
    }

    uploadImage(imageFile: File, path: string) {

        const uploadTask = this.storage.ref(path).put(imageFile);

        uploadTask.snapshotChanges().subscribe(snapshot => {
            switch (snapshot.state) {
                case 'running':
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    break;
                case 'completed':
                    console.log('Image uploaded successfully!');
                    break;
                case 'error':
                    console.error('Upload failed:', snapshot);
                    break;
            }
        });
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