import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IMaterial} from '../interfaces/material';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<IMaterial[]> {
    return this.http.get<IMaterial[]>(API_URL + 'materials');
  }

  public getByUserId(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}users/${id}/materials`);
  }
}
