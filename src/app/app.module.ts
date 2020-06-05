import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import {MaterialModule} from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerComponent } from './pages/player/player.component';
import {CloudService} from './services/cloud.service';
import {AudioService} from './services/audio.service';
import {ConfigService} from './config/config.service';
import {SettingsProvider} from './config/settings.provider';
import { UploadComponent } from './pages/upload/upload.component';
import {LoadingModule} from './shared/loading/loading.module';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import {AlertConfirmComponent} from './alert-confirm/alert-confirm.component'
import {AlertEditorComponent} from './alert-editor/alert-editor.component'
import { MusicListComponent } from './pages/musiclist/musiclist.component';


@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    UploadComponent,
    AlertDialogComponent,
    AlertConfirmComponent,
    AlertEditorComponent,
    MusicListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule
  ],
  providers: [
    CloudService,
    AudioService, 
    ConfigService,
    SettingsProvider,
    {
      'provide': APP_INITIALIZER,
      'useFactory': init,
      'deps': [SettingsProvider, HttpClient, ConfigService],
      'multi': true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function init(settingsProvider: SettingsProvider, http: HttpClient, configService: ConfigService){
  var loadSettings = configService.loadConfig(http, settingsProvider);
  return () => loadSettings;
}
