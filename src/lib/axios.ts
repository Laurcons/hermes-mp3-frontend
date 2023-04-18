import axiosStatic from 'axios';
import { config } from './config';
import { toast } from 'react-toastify';

export const axios = axiosStatic.create({
  baseURL: config.apiUrl,
});

export const handleErrors = (config?: { omit?: string[] }) => {
  return (err: any) => {
    if (err.response.data) {
      if (config?.omit?.includes(err.response.data.code)) {
        return err;
      }
      toast.error(err.response.data.message);
    } else {
      toast.error(err.message);
    }
    return err;
  };
};
