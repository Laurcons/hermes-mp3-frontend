import axiosStatic from 'axios';
import { config } from './config';

export const axios = axiosStatic.create({
  baseURL: config.apiUrl,
});
