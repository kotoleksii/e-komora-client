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

    public incrementViews(post: any): void {
        this.http.patch(`${baseUrl}/${post.id}/view`, post).subscribe(() => {
            post.views++;
        });
    }

    public incrementLikes(post: any): void {
        this.http.patch(`${baseUrl}/${post.id}/like`, post).subscribe(() => {
            post.likes++;
        });
    }

    public decrementLikes(post: any): void {
        this.http.patch(`${baseUrl}/${post.id}/dislike`, post).subscribe(() => {
            post.likes--;
        });
    }

    // public saveLikes(post: any): Observable<any> {
    //     return this.http.patch(`${baseUrl}/${post.id}/like`, post);
    // }

    public likePost(postId: number, userId: number): Observable<any> {
        return this.http.post('http://localhost:8080/api/user-post-likes/like', {postId, userId});
    }

    public dislikePost(postId: number, userId: number): Observable<any> {
        return this.http.delete(`http://localhost:8080/api/user-post-likes/${postId}/${userId}`);
    }

    public getLikeStatus(postId: number, userId: number): Observable<any> {
        return this.http.get<any>(`http://localhost:8080/api/user-post-likes/${postId}/${userId}`);
    }

    // public dislikePost(data: any): Observable<any> {
    //     return this.http.patch('http://localhost:8080/api/user-post-likes/dislike', data);
    // }
}
