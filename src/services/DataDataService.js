import http from "./http-common";

class DataDataService {
    getAll() {
        return http.get("/data");
    }

    getAllDev() {
        return http.get("/data/dev");
    }

    getByCustomer(customerId) {
        return http.get(`/dataByCus/${customerId}`);
    }

    get(id) {
        return http.get(`/data/${id}`);
    }

    getByCustomerDate(customerId, fromDate, toDate) {
        return http.get(`/data/${customerId}/${fromDate}/${toDate}`);
    }

    getDev(id) {
        return http.get(`/data/dev/${id}`);
    }

    create(data) {
        return http.post("/data", data);
    }

    update(id, data) {
        return http.put(`/data/${id}`, data);
    }

    delete(id) {
        return http.delete(`/data/${id}`);
    }

    // searchCustomer(query) {
    //     return http.get(`/items/search/${query}`);
    //     // return http.get(`/customers/search?q=${query}`);
    // }
}

export default new DataDataService();