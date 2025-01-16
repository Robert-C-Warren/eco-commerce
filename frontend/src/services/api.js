import axios from 'axios';

const API = axios.create({ baseURL: 'http://35.222.106.130:5000/'});

export default API;