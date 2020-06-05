import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'app-confirm',
    templateUrl: './alert-confirm.component.html'
})
export class AlertConfirmComponent {
    title: string = "Confirm?";
    message: string = "Are you sure you want to confirm?";
    confirmButtonText = "OK";
    cancelButtonText = "Cancel";
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<AlertConfirmComponent>) {
        if (data) {
            this.title = data.title || this.title;
            this.message = data.message || this.message;
            if (data.buttonText) {
                this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
                this.confirmButtonText = data.buttonText.confim || this.confirmButtonText;
            }
        }
        this.dialogRef.updateSize('300vw', '300vw')
    }

    onConfirmClick(): void {
        this.dialogRef.close(true);
    }

    onCancelClick(): void {
        this.dialogRef.close(false);
    }

}