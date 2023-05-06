import { useContext, useEffect, useState } from 'react';
import { AdminWsContext, VolunteerWsContext } from '../ws-contexts';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { LocationEvent } from '../../types/locationEvent';
import { ChatMessage } from '../../types/chatMessage';
import CookieManager from '../cookie-manager';
import { StatusEvent } from '@/types/statusEvent';
import { handleWsError, wrapPromise } from './common';
import { toast } from 'react-toastify';
import { Session } from '@/types/session';

export interface UseVolunteerWsProps {
  events: {
    'chat-message'?: (msg: ChatMessage) => void;
    'location-tracking'?: (isTracking: boolean) => void;
    user?: (session: Session) => void;
    connect?: () => void;
    disconnect?: () => void;
  };
}

export default function useVolunteerWs({ events }: UseVolunteerWsProps) {
  const ws = useContext(VolunteerWsContext);

  if (!ws)
    throw new Error('useVolunteerWs hook needs VolunteerWsContext provider');

  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(ws.connected);
  const [geolocTrackId, setGeolocTrackId] = useState<number>(0);

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
    if (data?.code === 'InvalidToken') {
      toast.error('Sesiune invalidă, te rog reconectează-te');
      return navigate('/');
    }
    toast.error(data.message);
  };

  const onLocationTracking = (isTracking: boolean) => {
    events['location-tracking']?.(isTracking);
    if (isTracking) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          ws.emit(
            'location',
            {
              lat: latitude,
              lon: longitude,
              acc: accuracy,
            },
            handleWsError,
          );
        },
        (err) => alert(err.message),
      );
      setGeolocTrackId(id);
    } else {
      navigator.geolocation.clearWatch(geolocTrackId);
    }
  };

  // websocket
  useEffect(() => {
    if (isConnected) return;
    const token = CookieManager.get('volunteerToken');
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
      'location-tracking': onLocationTracking,
    };
    for (const event of Object.keys(handledEvents)) {
      const handler =
        handledEvents[event as keyof UseVolunteerWsProps['events']];
      if (!handler) continue;
      ws.on(event, handler);
    }

    return function cleanup() {
      for (const event of Object.keys(handledEvents)) {
        const handler =
          handledEvents[event as keyof UseVolunteerWsProps['events']];
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
    setLocationTracking: wrapPromise((callback, isTracking: boolean) => {
      ws.emit('set-location-tracking', isTracking, callback);
    }),
  };
}
