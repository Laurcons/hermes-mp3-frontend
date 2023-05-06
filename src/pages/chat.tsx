import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import Layout from '../components/Layout';
import { UserWsContext, createUserWs } from '../lib/ws-contexts';
import useUserWs from '../lib/ws/useUserWs';
import LocationBanner from '../components/LocationBanner';
import UserChatBox from '../components/UserChatBox';
import { ChatMessage } from '../types/chatMessage';
import { config } from '../lib/config';
import { handleWsError } from '../lib/ws/common';
import { toast } from 'react-toastify';

export interface ChatPageState {
  messages: ChatMessage[];
  nickname: string;
  chatBadgeCount: number;
  tab: 'chat' | 'settings';
  isLocationTracking: boolean;
}

export type ChatPageAction =
  | { type: 'reset' }
  | { type: 'send-chat-message'; text: string }
  | { type: 'on-chat-message'; message: ChatMessage }
  | { type: 'set-nickname'; nickname: string }
  | { type: 'set-tab'; tab: 'chat' | 'settings' }
  | { type: 'set-location-tracking'; isLocationTracking: boolean };

const initialState: ChatPageState = {
  messages: [],
  nickname: '',
  chatBadgeCount: 0,
  tab: 'chat',
  isLocationTracking: false,
};

export default function ChatPage() {
  const ws = createUserWs();
  useEffect(
    () => () => {
      ws.disconnect();
    },
    [],
  );
  return (
    <UserWsContext.Provider value={ws}>
      <WrappedChatPage />
    </UserWsContext.Provider>
  );
}

function WrappedChatPage() {
  const [state, dispatch] = useReducer(chatPageReducer, initialState);

  const chat = useUserWs({
    events: {
      connect: useCallback(() => {
        dispatch({ type: 'reset' });
      }, []),
      'chat-message': useCallback((message: ChatMessage) => {
        dispatch({ type: 'on-chat-message', message });
      }, []),
      nickname: useCallback((nickname: string) => {
        dispatch({ type: 'set-nickname', nickname });
      }, []),
      'location-tracking': useCallback((isLocationTracking: boolean) => {
        dispatch({ type: 'set-location-tracking', isLocationTracking });
      }, []),
    },
  });

  function chatPageReducer(
    state: ChatPageState,
    action: ChatPageAction,
  ): ChatPageState {
    switch (action.type) {
      case 'reset':
        return initialState;
      case 'on-chat-message':
        return {
          ...state,
          chatBadgeCount: state.tab === 'chat' ? 0 : state.chatBadgeCount + 1,
          messages: [...state.messages, action.message],
        };
      case 'set-nickname':
        return {
          ...state,
          nickname: action.nickname,
        };
      case 'send-chat-message':
        return state;
      case 'set-tab':
        return {
          ...state,
          chatBadgeCount: state.tab === 'chat' ? 0 : state.chatBadgeCount,
          tab: action.tab,
        };
      case 'set-location-tracking':
        return {
          ...state,
          isLocationTracking: action.isLocationTracking,
        };
    }
  }

  function handleEvent(action: ChatPageAction) {
    switch (action.type) {
      case 'send-chat-message':
        chat.sendChatMessage(action.text).catch(handleWsError);
        break;
      case 'set-nickname':
        chat
          .setNickname(action.nickname)
          .then(() => toast.success('Pseudonim actualizat!'))
          .catch(handleWsError);
        break;
      case 'set-location-tracking':
        chat
          .setLocationTracking(action.isLocationTracking)
          .catch(handleWsError);
        break;
      default:
        dispatch(action);
    }
  }

  return (
    <>
      <Layout
        isLoading={!chat.isReady}
        disableNavbar={true}
        banner={
          <LocationBanner
            isTracking={state.isLocationTracking}
            onTrackingUpdate={(isLocationTracking) =>
              handleEvent({ type: 'set-location-tracking', isLocationTracking })
            }
          />
        }
      >
        <div className="flex flex-col h-full">
          <audio className="w-full flex-shrink-0 mb-3" controls>
            <source src={config.radioUrl} type="audio/mpeg" />
          </audio>
          <UserChatBox state={state} handle={handleEvent} />
        </div>
      </Layout>
    </>
  );
}
