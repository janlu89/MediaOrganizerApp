import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';
import { FileDetails } from 'src/app/interfaces/music-file';
import { MatDialog } from '@angular/material/dialog';
import { AlertConfirmComponent } from 'src/app/alert-confirm/alert-confirm.component';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { AlertEditorComponent } from 'src/app/alert-editor/alert-editor.component';

@Component({
  selector: 'musiclist-edit',
  templateUrl: './musiclist.component.html',
  styleUrls: ['./musiclist.component.scss']
})
export class MusicListComponent implements OnInit {
  public isLoading = false;
  public files: Array<FileDetails> = [];

  constructor(public cloudService: CloudService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadMusic();
  }

  async loadMusic() {
    try {
      this.isLoading = true;
      this.files = await this.cloudService.getFiles();
    }
    catch (e) {
      if (e.statusText == "Unknown Error") this.openAlertDialog("Error", "Something went wrong");
      else {
        let errors = e.error;
        errors.forEach(error => {
          this.openAlertDialog(error.errorCode || "Error", (error.description) || "Something went wrong");
        });
      }
    }
    finally {
      this.isLoading = false;
    }
  }

  async delete(file: FileDetails) {
    let isConfirmed = await this.openConfirmDialog();
    if (!isConfirmed || file.uri == "" || file.uri == null) return;
    this.isLoading = true;
    var formData: any = new FormData();
    try {
      formData.append('fileName', file.uri);
      let res = await this.cloudService.delete(formData);
      this.openAlertDialog('Success!', file.title + " " + res.toString());
      this.loadMusic();
    } 
    catch (e) {
      if (e.statusText == "Unknown Error") this.openAlertDialog("Error", "Something went wrong");
      else {
        let errors = e.error;
        errors.forEach(error => {
          this.openAlertDialog("Error", error.description || "Something went wrong")
        });
      }
    } finally {
      this.isLoading = false;
    }
  }

  async edit(file: FileDetails) {
    let res = await this.openEditorDialog(file);
    if (res) this.loadMusic();
  }

  openAlertDialog(title: string, message?: string, button?: string, ) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: title,
        message: message,
        buttonText: {
          cancel: button
        }
      },
    });
  }

  async openConfirmDialog(title?: string, message?: string, button?: string): Promise<boolean> {
    const dialogRef = this.dialog.open(AlertConfirmComponent, {
      data: {
        title: title,
        message: message,
        buttonText: {
          cancel: button
        }
      },
    });
    return await dialogRef.afterClosed().toPromise();
  }

  async openEditorDialog(file: FileDetails) {
    const dialogRef = this.dialog.open(AlertEditorComponent, {
      data: {
        title: file.title,
        artist: file.artist,
        uri: file.uri
      },
    });
    return await dialogRef.afterClosed().toPromise();
  }
}
