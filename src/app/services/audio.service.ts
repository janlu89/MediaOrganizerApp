import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as moment from 'moment';
import{StreamState} from '../interfaces/stream-state';

@Injectable()
export class AudioService {
  private state: StreamState = this.resetState();

private stop$ = new Subject();
private audioObj = new Audio();
audioEvents = [
  'ended',
  'error',
  'play',
  'playing',
  'pause',
  'timeupdate',
  'canplay',
  'loadedmetadata',
  'loadstart'
];

private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
  this.state
);

playStream(uri){
  return this.streamObservable(uri).pipe(takeUntil(this.stop$));
}

getState(): Observable<StreamState> {
  return this.stateChange.asObservable();
}

play() {
  this.audioObj.play();
}

pause() {
  this.audioObj.pause();
}

stop() {
  this.stop$.next();
}

seekTo(seconds) {
  this.audioObj.currentTime = seconds;
}

setVolume(volume){
  this.audioObj.volume = volume;
}

private streamObservable(uri):any{
  return new Observable( observer => {
    this.loadAndPlay(uri);

    const handler = (event: Event) => {
      this.updateStateEvents(event);
      observer.next(event);
    };
    
  this.addEvents(this.audioObj, this.audioEvents, handler);

  return() => {
    this.stopPlaying();
    this.removeEvents(this.audioObj, this.audioEvents, handler);
    this.resetState();
  }
  });
}

private addEvents(obj, events, handler) {
  events.forEach(event => {
    obj.addEventListener(event, handler);
  });
}

private updateStateEvents(event: Event): void {
  switch (event.type) {
    case "canplay":
      this.state.duration = this.audioObj.duration;
      this.state.readableDuration = this.formatTime(this.state.duration);
      this.state.canplay = true;
      break;
    case "playing":
      this.state.playing = true;
      break;
    case "pause":
      this.state.playing = false;
      break;
    case "ended":
      this.state.ended = true;
    break;
    case "timeupdate":
      this.state.currentTime = this.audioObj.currentTime;
      this.state.readableCurrentTime = this.formatTime(
        this.state.currentTime
      );
      break;
    case "error":
      this.state = this.resetState();
      this.state.error = true;
      break;
  }
  this.stateChange.next(this.state);
}

private removeEvents(obj, events, handler) {
  events.forEach(event => {
    obj.removeEventListener(event, handler);
  });
}

private loadAndPlay(uri){
  this.audioObj.src = uri;
  this.audioObj.load();
  this.audioObj.play();
}

private stopPlaying(){
  this.audioObj.pause();
  this.audioObj.currentTime = 0;
}

private resetState(): StreamState {
  return{
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    ended: false,
    error: false
  };
}

formatTime(time: number, format: string = "HH:mm:ss") {
  const momentTime = time * 1000;
  return moment.utc(momentTime).format(format);
}

}
