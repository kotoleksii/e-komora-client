import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IMaterial} from '../interfaces/material';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
    providedIn: 'root'
})
export class MaterialService {

    public constructor(private http: HttpClient) {
    }

    public getAll(): Observable<IMaterial[]> {
        return this.http.get<IMaterial[]>(API_URL + 'users/materials');
    }

    public getByUserId(id: number): Observable<any> {
        return this.http.get<any>(`${API_URL}users/${id}/materials`);
    }

    public getByMaterialId(id: number): Observable<any> {
        return this.http.get<any>(`${API_URL}users/material/${id}`);
    }

    public create(userId: any, data: any): Observable<any> {
        return this.http.post(`${API_URL}users/${userId}/materials/`, data);
    }

    public update(userId: any, materialId: any, data: any): Observable<any> {
        return this.http.put(`${API_URL}users/${userId}/materials/${materialId}`, data);
    }

    public send(userId: any, materialId: any, data: any): Observable<any> {
        return this.http.put(`${API_URL}users/${userId}/materials/${materialId}/send`, data);
    }

    public delete(userId: any, materialId: any): Observable<any> {
        return this.http.delete(`${API_URL}users/${userId}/materials/${materialId}`);
    }
}
