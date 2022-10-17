import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IPost} from '../interfaces/post';
import {Observable} from 'rxjs';

const baseUrl = 'http://localhost:8080/api/posts';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    public constructor(private http: HttpClient) {
    }

    public getAll(): Observable<IPost[]> {
        return this.http.get<IPost[]>(baseUrl);
    }

    public getAllDesc(): Observable<IPost[]> {
        return this.http.get<IPost[]>(`${baseUrl}/desc`);
    }

    public getAllPublished(): Observable<IPost[]> {
        return this.http.get<IPost[]>(`${baseUrl}/published`);
    }

    public getAllPublishedDesc(): Observable<IPost[]> {
        return this.http.get<IPost[]>(`${baseUrl}/published/desc`);
    }

    public get(id: any): Observable<IPost> {
        return this.http.get<IPost>(`${baseUrl}/${id}`);
    }

    public create(data: any): Observable<any> {
        return this.http.post(baseUrl, data);
    }

    public update(id: any, data: any): Observable<any> {
        return this.http.put(`${baseUrl}/${id}`, data);
    }

    public delete(id: any): Observable<any> {
        return this.http.delete(`${baseUrl}/${id}`);
    }

    public findByTitle(title: any): Observable<IPost[]> {
        return this.http.get<IPost[]>(`${baseUrl}?title=${title}`);
    }
}
