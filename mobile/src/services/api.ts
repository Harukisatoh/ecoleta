import axios from 'axios';

const api = axios.create({
    baseURL: 'http://BACKEND_IP:3333'
});

export default api;
