import axios from 'axios'

export default axios.create({
    // baseURL: 'http://1.10.11.107:8080/api/', //for AshDesk
    baseURL: 'http://127.0.0.1:8080/api/', //for localhost
    headers: {
        'Content-type': 'Application/json'
    }
})