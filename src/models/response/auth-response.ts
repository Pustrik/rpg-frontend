import {IUser} from "../i-user";

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: IUser;
    class_id?: number;
}