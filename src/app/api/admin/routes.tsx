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
    async createFood(data: FormData) {
        try {
            for (let [key, value] of data.entries()) {
                console.log(key, value);
            }
            const response = await authenticatedInstance.post("/api/food", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Food creation failed:", error);
            throw error;
        }
    }

}


const AdminAPi = new AdminRoutes();

export default AdminAPi;