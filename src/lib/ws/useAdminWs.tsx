import { useContext, useEffect, useState } from 'react';
import { AdminWsContext } from '../ws-contexts';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { LocationEvent } from '../../types/locationEvent';
import { ChatMessage } from '../../types/chatMessage';
import CookieManager from '../cookie-manager';
import { StatusEvent } from '@/types/statusEvent';
import { wrapPromise } from './common';
import { toast } from 'react-toastify';

export interface UseAdminWsProps {
  events: {
    'chat-message'?: (msg: ChatMessage) => void;
    'locations-update'?: (locs: LocationEvent[]) => void;
    status?: (status: StatusEvent) => void;
    connect?: () => void;
    disconnect?: () => void;
  };
}

export default function useAdminWs({ events }: UseAdminWsProps) {
  const ws = useContext(AdminWsContext);

  if (!ws) throw new Error('useAdminWs hook needs AdminWsContext provider');

  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(ws.connected);

  const onConnect = () => {
    events.connect?.();
    console.log('connected');
    setIsConnected(true);
  };

  const onDisconnect = () => {
    events.disconnect?.();
    setIsConnected(false);
  };

  const onConnectError = ({ data }: Error & { data: any }) => {
    if (data.code === 'InvalidToken') {
      toast.error('Sesiune invalidă, te rog reconectează-te');
      return navigate('/');
    }
    toast.error(data.message);
  };

  useEffect(() => {
    console.log({ isConnected });
  }, [isConnected]);

  // websocket
  useEffect(() => {
    if (isConnected) return;
    const token = CookieManager.get('adminToken');
    if (!token) {
      return navigate('/admin/login');
    }
    ws.auth = { token };
    ws.connect();
  }, [isConnected]);

  // websocket handlers
  useEffect(() => {
    const handledEvents = {
      ...events,
      connect: onConnect,
      disconnect: onDisconnect,
      connect_error: onConnectError,
    };
    for (const event of Object.keys(handledEvents)) {
      const handler = handledEvents[event as keyof UseAdminWsProps['events']];
      if (!handler) continue;
      ws.on(event, handler);
    }

    return function cleanup() {
      for (const event of Object.keys(handledEvents)) {
        const handler = handledEvents[event as keyof UseAdminWsProps['events']];
        if (!handler) continue;
        ws.off(event, handler);
      }
    };
  }, [...Object.values(events)]);

  return {
    isConnected,
    sendChatMessage: wrapPromise(
      (callback, room: 'volunteers' | 'participants', text: string) => {
        ws.emit('send-chat-message', room, text, callback);
      },
    ),
  };
}
