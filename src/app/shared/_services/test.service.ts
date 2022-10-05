import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) {
  }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', {responseType: 'text'});
  }

  getEmployeeBoard(): Observable<any> {
    return this.http.get(API_URL + 'dashboard/employee', {responseType: 'text'});
  }

  getHRBoard(): Observable<any> {
    return this.http.get(API_URL + 'dashboard/hr', {responseType: 'text'});
  }

  getAccountantBoard(): Observable<any> {
    return this.http.get(API_URL + 'dashboard/accountant', {responseType: 'text'});
  }
}
