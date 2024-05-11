import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUploadEvent } from 'primeng/fileupload';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/database';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrl: './newuser.component.css'
})

export class NewuserComponent {
  mode: true
  visible: boolean = false;
  uploadedFiles: any;
  uid: any;
  @ViewChild('userForm') userForm!: NgForm;
  constructor(private dataService: DataService, private authService: AuthService) { }
  imageUrl: string;

  newUser() {
    this.visible = true;
  }

  cancel() {
    this.visible = false
    this.userForm.resetForm();
  }

  addUser(userdata) {
    this.authService.setLoaderValue(true)
    console.log(this.uid, "klklkl");

    userdata = { ...userdata, uid: this.uid }
    this.dataService.setData(userdata.uid, userdata)
    this.visible = false
    this.userForm.resetForm();
    this.authService.setLoaderValue(false)
  }

  newUser1() {
    this.dataService.getImageUrl(this.uid)
      .subscribe(url => {
        this.imageUrl = url;
        console.log(this.imageUrl, "klklkl");

      });
  }

  onUpload(event: FileUploadEvent) {
    console.log(this.uid, "klklkl");

    console.log(event, "klklkl");

    for (let file of event.files) {
      console.log(file, "klklkl");

      this.uid = uuidv4()
      console.log(this.uid, "klklkl");

      this.dataService.uploadImage(file, this.uid);
    }
  }
}
