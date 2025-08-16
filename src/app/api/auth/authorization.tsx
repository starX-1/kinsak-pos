// import axios from "axios";
import instance from "@/app/Hooks/axios"
const url = "/api/auth/"
// const rbac = "/api/v1/rbac/user/"


class AuthApi {
    // replaced login with next auth
    // async login(username: string, password: string) {
    //     try {
    //         console.log(instance)
    //         const response = await instance.post(`${url}login`, { username, password });
    //         return response.data;
    //     } catch (error) {
    //         console.error('Login failed:', error);
    //         throw error;
    //     }
    // }

    async register(data: { name: string, email: string, password: string, restaurantName: string, restaurantLocation: string }) {
        try {
            const response = await instance.post(`${url}register`, data);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
    async getUserById(id: string) {
        try {
            const response = await instance.get(`${url}one/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    // async createRole(email: string, role: string, username: string, id: string) {
    //     try {
    //         const response = await instance.post(`${rbac}create`, { email, role, username, id });
    //         return response.data;
    //     } catch (error) {
    //         console.error('Registration failed:', error);
    //         throw error;
    //     }
    // }
    // async getAllRoles() {
    //     try {
    //         const response = await instance.get('/api/v1/roles/all');
    //         return response.data.data;
    //     } catch (error) {
    //         console.error('Role fetch failed:', error);
    //         throw error;
    //     }
    // }
    
}

const auth = new AuthApi();

export default auth;