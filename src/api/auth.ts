import axios from "axios";

const api = axios.create({
    baseURL: '/api/auth',
});

export const login = (credentials: any) => {
    return api.post('/login', credentials);
};

export const register = (userData: any) => {
    return api.post('/register', userData);
};
