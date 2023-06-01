import axios from 'axios';

const config = require('../config.json');

const instance = axios.create({
  baseURL: config.server
});

export default instance;
