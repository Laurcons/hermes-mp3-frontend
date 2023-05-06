import { useContext, useEffect, useState } from 'react';
import { UserWsContext } from '../ws-contexts';
import { axios, handleErrors } from '../axios';
import Cookies from 'js-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleWsError, wrapPromise } from './common';
import CookieManager from '../cookie-manager';
import { toast } from 'react-toastify';
import { Session } from '@/types/session';

export interface UseUserWsProps {
  events: {
    'chat-message'?: (msg: any) => void;
    'location-tracking'?: (isTracking: boolean) => void;
    session?: (session: Session) => void;
    nickname?: (nick: string) => void; // received when connecting to a session
    connect?: () => void;
    disconnect?: () => void;
  };
}

export default function useUserWs({ events }: UseUserWsProps) {
  const ws = useContext(UserWsContext);
  if (!ws) throw new Error('useUserWs hook needs UserWsContext provider');

  const [isConnected, setIsConnected] = useState(ws.connected);
  const [geolocTrackId, setGeolocTrackId] = useState<number>(0);
  const navigate = useNavigate();

  // tracking connection/disconnection doesn't work
  //  without changing state and making React re-render stuff
  const onConnect = () => {
    events.connect?.();
    setIsConnected(true);
  };

  const onDisconnect = () => {
    events.disconnect?.();
    setIsConnected(false);
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

  const onConnectError = ({ data }: Error & { data: any }) => {
    if (data.code === 'InvalidToken') {
      toast.error('Sesiune invalidă, te rog reconectează-te');
      return navigate('/');
    }
    toast.error(data.message);
  };

  // websocket
  useEffect(() => {
    if (isConnected) return;
    const token = CookieManager.get('token');
    if (!token) {
      return navigate('/');
    }
    ws.auth = {
      token,
    };
    ws.connect();
  }, [isConnected]);

  // websocket handlers
  useEffect(() => {
    // add own event handlers
    const handledEvents = {
      ...events,
      exception: handleWsError,
      connect: onConnect,
      disconnect: onDisconnect,
      connect_error: onConnectError,
      'location-tracking': onLocationTracking,
    };

    for (const event of Object.keys(handledEvents)) {
      const handler = handledEvents[event as keyof UseUserWsProps['events']];
      if (!handler) continue;
      ws.on(event, handler);
    }

    return function cleanup() {
      if (!ws) return;
      for (const event of Object.keys(handledEvents)) {
        const handler = handledEvents[event as keyof UseUserWsProps['events']];
        if (!handler) continue;
        ws.off(event, handler);
      }
    };
  }, [...Object.values(events)]);

  return {
    isReady: isConnected,
    sendChatMessage: wrapPromise((callback, text: string) => {
      ws.emit('send-chat-message', text, callback);
    }),
    setNickname: wrapPromise((callback, nickname: string) => {
      ws.emit('set-nickname', nickname, callback);
    }),
    setLocationTracking: wrapPromise((callback, isTracking: boolean) => {
      ws.emit('set-location-tracking', isTracking, callback);
    }),
  };
}
