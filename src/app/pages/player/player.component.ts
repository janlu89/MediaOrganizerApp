import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { CloudService } from '../../services/cloud.service';
import { StreamState } from '../../interfaces/stream-state';
import { FileDetails } from '../../interfaces/music-file';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  public isLoading = false;
  public files: Array<FileDetails> = [];
  public state: StreamState;
  public currentFile: any = {};
  public volume: number = 1;
  public veritcalSlider: boolean = true;
  public displayVolume = false;
  public isLoopPlaying: boolean = true;

  constructor(public audioService: AudioService, public cloudService: CloudService, private dialog: MatDialog) {
    this.audioService.getState().subscribe(state => {
      this.state = state;
    });
  }

  ngOnInit() {
    this.loadMusic();
  }

  async loadMusic() {
    try {
      this.isLoading = true;
      this.files = await this.cloudService.getFiles();
    }
    catch(e) {
      if(e.statusText == "Unknown Error")  this.openAlertDialog( "Error", "Something went wrong");
      else{
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

  playStream(uri) {
    this.audioService.playStream(uri).subscribe(event => {
      if (this.state.ended && this.isLoopPlaying) { this.next(); this.state.ended = false }
    })
  }

  openFile(musicFile, index) {
    this.currentFile = { index, musicFile };
    this.audioService.stop();
    this.playStream(musicFile.uri);
  }

  play() {
    this.audioService.play();
  }

  pause() {
    this.audioService.pause();
  }

  stop() {
    this.audioService.stop();
  }

  next() {
    let index = !this.isLastPlaying() ? this.currentFile.index + 1 : 0;
    const musicFile = this.files[index];
    this.openFile(musicFile, index);
  }

  previous() {
    const index = !this.isFirstPlaying() ? this.currentFile.index - 1 : this.files.length - 1;
    const musicFile = this.files[index];
    this.openFile(musicFile, index);
  }

  toggleLoopPlay() {
    this.isLoopPlaying = !this.isLoopPlaying;
    return this.isLoopPlaying;
  }

  isFirstPlaying(): boolean {
    return this.currentFile.index === 0;
  }

  isLastPlaying(): boolean {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value)
  }

  displayVolumeControl() {
    this.displayVolume = !this.displayVolume;
  }

  onVolumeChange(change) {
    this.audioService.setVolume(change.value)
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
}
