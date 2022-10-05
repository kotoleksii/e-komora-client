import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IUser} from '../interfaces/user';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<any> {
    return this.http.get<IUser[]>(API_URL + 'users');
  }

  public getById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}users/${id}`);
  }

  public update(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URL}users/${id}`, data);
  }

  public changePassword(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URL}users/${id}/changePassword`, data);
  }

  public deleteById(id: any): Observable<any> {
    return this.http.delete<any>(API_URL + 'users/' + id);
  }
}
