import { Component, OnInit } from '@angular/core';
import {CloudService} from '../../services/cloud.service';
import { FormBuilder, Validators, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

const NO_SPECIAL_CHAR = /^[^*|\":<>[\]{}`\\()';@&$éàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]+$/;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  public isLoading = false;
  public payload = new FormData();

  constructor(public cloudService: CloudService, private formBuilder: FormBuilder, private dialog: MatDialog) {
    this.buildForm();
   }

   public musicForm: FormGroup;

   get formValue(){ return this.musicForm.value; }
   get artist() {return this.musicForm.get("artist");}
   get title() {return this.musicForm.get("title");}
   get musicFile() {return this.musicForm.get("musicFile");}
   
  ngOnInit(): void {
  }

  buildForm() {
    this.musicForm = this.formBuilder.group(
        {
          musicFile: ['', [Validators.required]],
          artist: ['', [Validators.required, Validators.pattern(NO_SPECIAL_CHAR)]],
          title: ['', [Validators.required, Validators.pattern(NO_SPECIAL_CHAR)]]
        });
    }

    async uploadMusic(formDirective: FormGroupDirective){
      this.musicFile.markAllAsTouched();
      if(this.musicForm.invalid){
        return;
      }
      this.isLoading = true;
      var formData: any = new FormData();
      console.log(formDirective);
      try
      {
        formData.append('musicFile', this.musicForm.get("musicFile").value);
        formData.append('artist', this.musicForm.get("artist").value);
        formData.append('title', this.musicForm.get("title").value);
        let res = await this.cloudService.postFile(formData);      
        formDirective.resetForm();
        this.musicForm.reset(this.musicForm.value);
        this.openAlertDialog('Success!', res.toString());
      }
      catch(e) {
        if(e.statusText == "Unknown Error")  this.openAlertDialog( "Error", "Something went wrong");
        else{
        console.log(e.error)
        let errors = e.error;
        errors.forEach(error => {
          this.openAlertDialog(error.errorCode || "Error", error.description || "Something went wrong");
        }); 
      }       
      }
      finally
      {
        this.isLoading = false; 
      }
    }

    uploadFile(event) {
      let newFile = (event.target as HTMLInputElement).files[0];
      this.musicForm.patchValue({
        musicFile: newFile
      });
      this.musicForm.get('musicFile').updateValueAndValidity();
    }

    openAlertDialog(title: string, message?: string, button?: string,) {
      const dialogRef = this.dialog.open(AlertDialogComponent,{
        data:{
          title: title,
          message: message,
          buttonText: {
            cancel: button
          }
        },
      });
    }
}
