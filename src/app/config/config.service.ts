import { Injectable } from '@angular/core';
import { IConfig } from './config.defs';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SettingsProvider } from './settings.provider';


@Injectable()
export class ConfigService {

    private _http: HttpClient;
    config: IConfig;

    constructor() {
    }


    public loadConfig(http: HttpClient, settingsProvider: SettingsProvider): Promise<Boolean> {


    
      return  this.loadSettings(http,settingsProvider).then((result) => { return true});

    }


    loadSettings(http: HttpClient, settingsProvider: SettingsProvider): Promise<IConfig>
    {
        return settingsProvider.loadConfig(http);
    }
}
