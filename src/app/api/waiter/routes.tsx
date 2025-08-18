import authenticatedInstance from "@/app/Hooks/tokenAxios";

class WaiterRoutes {
    // menu 
    async getMenu() {
        try {
            const response = await authenticatedInstance.get("/api/food");
            return response.data;
        } catch (error) {
            console.error('Failed to fetch menu:', error);
            throw error;
        }
    }
    async getSingleFood(id: string) {
        try {
            const response = await authenticatedInstance.get(`/api/waiter/menu/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch food item:', error);
            throw error;
        }
    }

    // orders 
    async makeOrderMpesa(data: {
        items: { foodId: string, qty: number }[],
        paymentMethod: "mpesa",
        customerPhone: string,
    }) {
        try {
            const response = await authenticatedInstance.post("/api/orders", data);
            return response.data;
        } catch (error) {
            console.error("Order creation failed:", error);
            throw error;
        }
    }
    async makeOrderCash(data: {
        items: { foodId: string, qty: number }[],
        paymentMethod: "cash",
    }) {
        try {
            const response = await authenticatedInstance.post("/api/orders", data);
            return response.data;
        } catch (error) {
            console.error("Order creation failed:", error);
            throw error;
        }
    }
}


export default new WaiterRoutes();