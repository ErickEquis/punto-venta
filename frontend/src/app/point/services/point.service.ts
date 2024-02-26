import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PointService {

  url: string

  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.endpoint}`
  }

}
