import http from "./http-common";

class CustomerDataService {
    getAll() {
        return http.get("/customers");
    }

    get(id) {
        return http.get(`/customers/${id}`);
    }

    create(data) {
        return http.post("/customers", data);
    }

    update(id, data) {
        return http.put(`/customers/${id}`, data);
    }

    delete(id) {
        return http.delete(`/customers/${id}`);
    }

    searchCustomer(query) {
        return http.get(`/customers/search/${query}`);
        // return http.get(`/customers/search?q=${query}`);
    }
}

export default new CustomerDataService();