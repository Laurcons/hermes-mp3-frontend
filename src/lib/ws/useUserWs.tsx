import { useContext, useEffect, useState } from 'react';
import { UserWsContext } from '../ws-contexts';
import { axios, handleErrors } from '../axios';
import Cookies from 'js-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleWsError } from './common';

export interface UseUserWsProps {
  events: {
    'chat-message'?: (msg: any) => void;
    'location-tracking'?: (isTracking: boolean) => void;
    connect?: () => void;
    disconnect?: () => void;
  };
  withLocationTracking?: boolean;
}

export default function useUserWs({
  events,
  withLocationTracking = false,
}: UseUserWsProps) {
  const ws = useContext(UserWsContext);
  const [token, setToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [geolocTrackId, setGeolocTrackId] = useState<number>(0);
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();

  if (!ws) throw new Error('useUserWs hook needs UserWsContext provider');

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

  // get token
  useEffect(() => {
    const getToken = async () => {
      let token = Cookies.get('userToken');
      if (!token) {
        const recaptchaToken = queryParams.get('recaptcha');
        const sessRes = await axios
          .post('/session', { recaptchaToken })
          .catch(handleErrors());
        token = sessRes.data.token;
        Cookies.set('userToken', token!);
      }
      navigate('/chat'); // remove the query param thing
      setToken(token!);
    };
    getToken();
  }, []);

  // websocket
  useEffect(() => {
    if (!token) return;
    ws.auth = {
      token,
    };
    ws.connect();
    return function cleanup() {
      if (!ws) return;
      ws.disconnect();
    };
  }, [token]);

  // websocket handlers
  useEffect(() => {
    if (!token) return;
    // add own event handlers
    const handledEvents = {
      ...events,
      exception: handleWsError(),
      connect: onConnect,
      disconnect: onDisconnect,
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
  }, [token, ...Object.values(events)]);

  // location tracking
  useEffect(() => {
    if (!(token && ws.active)) return;
    if (withLocationTracking) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          ws.emit('location', {
            lat: latitude,
            lon: longitude,
            acc: accuracy,
          });
        },
        (err) => alert(err.message),
      );
      setGeolocTrackId(id);
      return function cleanup() {
        navigator.geolocation.clearWatch(id);
      };
    } else {
      navigator.geolocation.clearWatch(geolocTrackId);
    }
  }, [withLocationTracking, token, ws.active]);

  return {
    isReady: isConnected,
    sendChatMessage(text: string) {
      ws.emit('send-chat-message', text);
    },
    updateNickname(nickname: string) {
      ws.emit('update-nickname', nickname);
    },
    setLocationTracking(isTracking: boolean) {
      ws.emit('set-location-tracking', isTracking);
    },
  };
}
