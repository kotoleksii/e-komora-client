import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IUser} from '../interfaces/user';

const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(API_URL + 'users/');
  }

  public getById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}users/${id}`);
  }

  public update(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URL}users/${id}`, data);
  }

  // public create(body: any): Observable<any> {
  //   return this.http.post(API_URL + 'users/', body);
  // }

  public editById(id: number, body: any): Observable<any> {
    return this.http.patch(API_URL + 'users/' + id, body);
  }

  public deleteById(id: any): Observable<any> {
    return this.http.delete<any>(API_URL + 'users/' + id);
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
