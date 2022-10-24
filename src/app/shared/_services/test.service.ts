import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
    providedIn: 'root'
})
export class TestService {

    public constructor(private http: HttpClient) {
    }

    public getPublicContent(): Observable<any> {
        return this.http.get(API_URL + 'all', {responseType: 'text'});
    }

    public getEmployeeBoard(): Observable<any> {
        return this.http.get(API_URL + 'dashboard/employee', {responseType: 'text'});
    }

    public getHRBoard(): Observable<any> {
        return this.http.get(API_URL + 'dashboard/hr', {responseType: 'text'});
    }

    public getAccountantBoard(): Observable<any> {
        return this.http.get(API_URL + 'dashboard/accountant', {responseType: 'text'});
    }

    public sendContactFormMessage(data: any): Observable<any> {
        return this.http.post(API_URL + 'contactForm', data);
    }
}
