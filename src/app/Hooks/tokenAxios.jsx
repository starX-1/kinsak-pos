import axios from "axios";
import { getSession } from "next-auth/react";

const authenticatedInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

authenticatedInstance.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session) {
        config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
},
    (error) => {
        return Promise.reject(error);
    }
);

export default authenticatedInstance;

//}