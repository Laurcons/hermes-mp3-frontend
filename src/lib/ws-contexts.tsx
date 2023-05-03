import { createContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { config } from './config';

export const UserWsContext = createContext<Socket | null>(null);

export const createUserWs = () => {
  return io(config.apiUrl, {
    path: '/user',
    autoConnect: false,
    transports: ['polling'],
  });
};

export const AdminWsContext = createContext<Socket | null>(null);

export const createAdminWs = () => {
  return io(config.apiUrl, {
    path: '/admin',
    autoConnect: false,
    transports: ['polling'],
  });
};

export const VolunteerWsContext = createContext<Socket | null>(null);

export const createVolunteerWs = () => {
  return io(config.apiUrl, {
    path: '/volunteer',
    autoConnect: false,
    transports: ['polling'],
  });
};
