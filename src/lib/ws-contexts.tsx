import { createContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { config } from './config';

export const UserWsContext = createContext<Socket | null>(null);

export const createUserWs = () => {
  return io(config.apiUrl, {
    path: '/user',
    autoConnect: false,
    transports: ['websocket', 'polling'],
  });
};

export const AdminWsContext = createContext<Socket | null>(null);

export const createAdminWs = () => {
  return io(config.apiUrl, {
    path: '/admin',
    autoConnect: false,
    transports: ['websocket', 'polling'],
  });
};
