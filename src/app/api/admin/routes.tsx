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
    async updateWaiter(id: string, data: { name: string, email: string, password: string }) {
        try {
            const response = await authenticatedInstance.put(`/api/admin/waiters/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Update failed:', error);
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
    async createFood(data: {
        name: string,
        description: string,
        price: string,
        category: string,
        image: File | Blob | string
    }) {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("category", data.category);

            if (data.image) {
                formData.append("image", data.image);
            }

            const response = await authenticatedInstance.post("/api/food", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log(response)
            return response.data;
        } catch (error) {
            console.error("Food creation failed:", error);
            throw error;
        }
    }


}


const AdminAPi = new AdminRoutes();

export default AdminAPi;