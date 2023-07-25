import axios from 'axios';
import {AuthResponse} from "../models/response/auth-response";
export const API_URL = 'http://localhost:8080/rpg';
const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});
api.interceptors.request.use((config => {
    // @ts-ignore
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
}));

api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const original_req = error.config;
    if(error.response.status == 401 && error.config && !error.config._isRetry) {
        original_req._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data.access_token);
            return api.request(original_req);
        } catch (e) {
            console.log('Не авторизован');
        }
    }
    throw error;
})

export default api;