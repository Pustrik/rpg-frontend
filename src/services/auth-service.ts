import {AxiosResponse} from 'axios';
import {AuthResponse} from "../models/response/auth-response";
import api from "../http";

export default class AuthService {
    static async login(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>('/login', {username, password});
    }

    static async registration(username: string, email: string, password: string, password_d: string, class_id: number): Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>('/registration', {username, email, password, password_d, class_id});
    }

    static async changeUserData(id: string, username: string, password: string, password_d: string, password_old: string, class_id: number) {
        return api.put<AuthResponse>('/update', {id, username, password, password_d, password_old, class_id});
    }
    static async logout() {
        return api.post<AuthResponse>('/logout');
    }
}