import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IPost} from '../interfaces/post';
import {Observable} from 'rxjs';

const postsUrl = 'http://localhost:8080/api/posts';
const postsLikesUrl = 'http://localhost:8080/api/posts/likes';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    public constructor(private http: HttpClient) {
    }

    public getAll(): Observable<IPost[]> {
        return this.http.get<IPost[]>(postsUrl);
    }

    public getAllDesc(): Observable<IPost[]> {
        return this.http.get<IPost[]>(`${postsUrl}/desc`);
    }

    public getAllPublished(): Observable<IPost[]> {
        return this.http.get<IPost[]>(`${postsUrl}/published`);
    }

    public getAllPublishedDesc(): Observable<IPost[]> {
        return this.http.get<IPost[]>(`${postsUrl}/published/desc`);
    }

    public get(id: any): Observable<IPost> {
        return this.http.get<IPost>(`${postsUrl}/${id}`);
    }

    public create(data: any): Observable<any> {
        return this.http.post(postsUrl, data);
    }

    public update(id: any, data: any): Observable<any> {
        return this.http.put(`${postsUrl}/${id}`, data);
    }

    public delete(id: any): Observable<any> {
        return this.http.delete(`${postsUrl}/${id}`);
    }

    public findByTitle(title: any): Observable<IPost[]> {
        return this.http.get<IPost[]>(`${postsUrl}?title=${title}`);
    }

    public incrementViews(post: any): void {
        this.http.patch(`${postsUrl}/${post.id}/view`, post).subscribe(() => {
            post.views++;
        });
    }

    // public incrementLikes(post: any): void {
    //     this.http.patch(`${baseUrl}/${post.id}/like`, post).subscribe(() => {
    //         post.likes++;
    //     });
    // }
    //
    // public decrementLikes(post: any): void {
    //     this.http.patch(`${baseUrl}/${post.id}/dislike`, post).subscribe(() => {
    //         post.likes--;
    //     });
    // }

    // public saveLikes(post: any): Observable<any> {
    //     return this.http.patch(`${baseUrl}/${post.id}/like`, post);
    // }

    public getLikes(): Observable<any> {
        return this.http.get<any>(postsLikesUrl);
    }

    public getLikesByUserId(userId: number): Observable<any> {
        return this.http.get<any>(`${postsLikesUrl}/${userId}`);
    }

    public getLikeStatus(postId: number, userId: number): Observable<any> {
        return this.http.get<any>(`${postsLikesUrl}/${postId}/${userId}`);
    }

    public likePost(postId: number, userId: number): Observable<any> {
        return this.http.post(`${postsLikesUrl}/${postId}/${userId}`, {});
    }

    public dislikePost(postId: number, userId: number): Observable<any> {
        return this.http.delete(`${postsLikesUrl}/${postId}/${userId}`);
    }

    // public dislikePost(data: any): Observable<any> {
    //     return this.http.patch('http://localhost:8080/api/user-post-likes/dislike', data);
    // }
}
