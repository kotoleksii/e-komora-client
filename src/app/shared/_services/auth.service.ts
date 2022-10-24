import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public constructor(private http: HttpClient) {
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      email,
      password
    }, httpOptions);
  }

  public register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      firstName,
      lastName,
      email,
      password
    }, httpOptions);
  }
}
