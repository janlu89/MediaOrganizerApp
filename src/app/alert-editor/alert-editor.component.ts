import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CloudService } from '../services/cloud.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

const NO_SPECIAL_CHAR = /^[^*|\":<>[\]{}`\\()';@&$éàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]+$/;

@Component({
    selector: 'app-editor',
    templateUrl: './alert-editor.component.html'
})
export class AlertEditorComponent {
    public isLoading = false;
    public formTitle: string = "Editor";
    public artistLabel: string = "Artist";
    public titleLabel: string = "Title";
    public artist: string = "";
    public title: string = "";
    public uri: string = "";
    public confirmButtonText = "OK";
    public cancelButtonText = "Cancel";
    public editorForm = new FormGroup({
        artist: new FormControl(),
        title: new FormControl()
    })

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<AlertEditorComponent>,
        private formBuilder: FormBuilder,
        public cloudService: CloudService,
        private dialog: MatDialog) {
        this.buildModal(data);
        this.dialogRef.updateSize('90%', '500vw');
        this.buildForm();
    }

    buildModal(data: any){
        if (this.data) {
            this.formTitle = data.formTitle || this.formTitle;
            this.titleLabel = data.titleLabel || this.titleLabel;
            this.artistLabel = data.artistLabel || this.artistLabel;
            this.artist = data.artist || this.artist;
            this.title = data.title || this.title;
            this.uri = data.uri || this.uri;
        }
    }

    buildForm() {
        this.editorForm = this.formBuilder.group(
            {
                artist: [this.artist, [Validators.required, Validators.pattern(NO_SPECIAL_CHAR)]],
                title: [this.title, [Validators.required, Validators.pattern(NO_SPECIAL_CHAR)]]
            });
    }

    async onConfirmClick(): Promise<void> {
        if(this.editorForm.invalid) return;
        var formData: any = new FormData();
        this.isLoading = true;
        try {
            formData.append('uri', this.uri);
            formData.append('artist', this.editorForm.get("artist").value);
            formData.append('title', this.editorForm.get("title").value);
            let res = await this.cloudService.putFile(formData);
            await this.openAlertDialog('Success!', this.title +" "+ res.toString());
            this.dialogRef.close(true);
        }
        catch (e) {
            if(e.statusText == "Unknown Error")  this.openAlertDialog( "Error", "Something went wrong");
            else{
            console.log(e.error)
            let errors = e.error;
            errors.forEach(error => {
              this.openAlertDialog(error.errorCode || "Error", error.description || "Something went wrong")
            });
        }
            this.dialogRef.close(false);
        }
        finally {
            this.isLoading = false; 
        }
    }

    onCancelClick(): void {
        this.dialogRef.close(false);
    }

    async openAlertDialog(title: string, message?: string, button?: string,) {
        const dialogRef = this.dialog.open(AlertDialogComponent,{
          data:{
            title: title,
            message: message,
            buttonText: {
              cancel: button
            }
          },
        });
        await dialogRef.afterClosed().toPromise();
      }
}