import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IPost} from '../interfaces/Post';
import {Observable} from 'rxjs';

const baseUrl = 'http://localhost:8080/api/posts';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<IPost[]> {
    return this.http.get<IPost[]>(baseUrl);
  }

  getAllPublished(): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${baseUrl}/published`);
  }

  get(id: any): Observable<IPost> {
    return this.http.get<IPost>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  findByTitle(title: any): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${baseUrl}?title=${title}`);
  }
}
