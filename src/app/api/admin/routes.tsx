import authenticatedInstance from "../../Hooks/tokenAxios";

class AdminRoutes {
    async registerWaiter(data: { name: string, email: string, password: string }) {
        try {
            const response = await authenticatedInstance.post("/api/auth/register-waiter", data);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
    async getAllWaiters() {
        try {
            const response = await authenticatedInstance.get("/api/admin/waiters");
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
    async getAdminRestaurant() {
        try {
            const response = await authenticatedInstance.get("/api/admin/restaurant");
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
}


const AdminAPi = new AdminRoutes();

export default AdminAPi;