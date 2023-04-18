import { useContext, useEffect, useState } from 'react';
import { AdminWsContext } from '../ws-contexts';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { LocationEvent } from '../../types/locationEvent';
import { ChatMessage } from '../../types/chatMessage';

export interface UseAdminWsProps {
  events: {
    'chat-message'?: (msg: ChatMessage) => void;
    'locations-update'?: (locs: LocationEvent[]) => void;
    'global-location-tracking-percent'?: (percent: number) => void;
    connect?: () => void;
  };
}

export default function useAdminWs({ events }: UseAdminWsProps) {
  const ws = useContext(AdminWsContext);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!ws) throw new Error('useAdminWs hook needs AdminWsContext provider');

  // get token
  useEffect(() => {
    const token = Cookies.get('adminToken');
    if (!token) {
      return navigate('/admin/login');
    }
    setToken(token);
  }, []);

  // websocket
  useEffect(() => {
    ws.auth = {
      token,
    };
    ws.connect();
    ws.on('chat-message', console.log);
    return function cleanup() {
      if (!ws) return;
      ws.disconnect();
      ws.off('chat-message', console.log);
    };
  }, [token]);

  // websocket handlers
  useEffect(() => {
    if (!token) return;
    console.log('Reattaching handlers');
    for (const event of Object.keys(events)) {
      const handler = events[event as keyof UseAdminWsProps['events']];
      if (!handler) continue;
      ws.on(event, handler);
    }

    return function cleanup() {
      console.log('Cleaning up handlers');
      for (const event of Object.keys(events)) {
        const handler = events[event as keyof UseAdminWsProps['events']];
        if (!handler) continue;
        ws.off(event, handler);
      }
    };
  }, [token, ...Object.values(events)]);

  return {
    isReady: ws.active && token,
    sendChatMessage(text: string) {
      ws.emit('send-chat-message', text);
    },
  };
}
