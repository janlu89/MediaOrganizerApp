import { Injectable } from '@angular/core';
import { IConfig } from './config.defs';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable()
export class SettingsProvider {

  private _http: HttpClient;
  private config: IConfig;

  constructor() {
  }


  public loadConfig(http: HttpClient): Promise<IConfig> {
    return this.getJSON(http)
      .pipe<IConfig>(tap((env: IConfig) => (this.config = env)))
      .toPromise<IConfig>();
  }

  public getJSON(http: HttpClient): Observable<IConfig> {
    if (environment.production) {
      return http.get<IConfig>('../../../assets/site_config.json');
    }
    else {
      return http.get<IConfig>('../../../assets/site_dev_config.json');
    }
  }

  public get configuration(): IConfig {
    return this.config;
  }


}
