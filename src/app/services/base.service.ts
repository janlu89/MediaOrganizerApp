import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BaseService {
  constructor() { }

  protected prepareHeaders(): any {
    let headers = new HttpHeaders();
    headers = headers
        .set('Content-Type', 'application/json');
    return { headers };
}
}
