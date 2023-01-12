import {Injectable} from '@angular/core';
import {IUser} from '../interfaces/user';
import * as CryptoJS from 'crypto-js';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    public constructor() {
    }

    public signOut(): void {
        window.sessionStorage.clear();
    }

    public saveToken(token: string): void {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string | null {
        return window.sessionStorage.getItem(TOKEN_KEY);
    }

    public saveUser(user: any): void {
        window.sessionStorage.removeItem(USER_KEY);
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(user), 'eWorkSecretKey').toString();
        window.sessionStorage.setItem(USER_KEY, ciphertext);
        // window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    public getUser(): IUser | any {
        const user = window.sessionStorage.getItem(USER_KEY);
        if (user) {
            let bytes = CryptoJS.AES.decrypt(user, 'eWorkSecretKey');
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            // return JSON.parse(user);
        }

        return {};
    }
}
