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
import ChatBox from '../components/ChatBox';
import { ChatMessage } from '../types/chatMessage';
import { config } from '../lib/config';
import { handleWsError } from '../lib/ws/common';

export interface ChatPageState {
  messages: ChatMessage[];
  nickname: string;
  chatBadgeCount: number;
  tab: 'chat' | 'settings';
}

export type ChatPageAction =
  | { type: 'send-chat-message'; text: string }
  | { type: 'on-chat-message'; message: ChatMessage }
  | { type: 'set-nickname'; nickname: string }
  | { type: 'set-tab'; tab: 'chat' | 'settings' };

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
  const [state, dispatch] = useReducer(chatPageReducer, {
    messages: [],
    nickname: '',
    chatBadgeCount: 0,
    tab: 'chat',
  });

  const chat = useUserWs({
    events: {
      'chat-message': useCallback(
        (message: ChatMessage) => {
          dispatch({ type: 'on-chat-message', message });
        },
        [state.messages],
      ),
    },
  });

  function chatPageReducer(
    state: ChatPageState,
    action: ChatPageAction,
  ): ChatPageState {
    switch (action.type) {
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
    }
  }

  function handleEvent(action: ChatPageAction) {
    switch (action.type) {
      case 'set-nickname':
        chat
          .updateNickname(action.nickname)
          .then(() => dispatch(action))
          .catch(handleWsError);
        break;
      case 'send-chat-message':
        chat
          .sendChatMessage(action.text)
          .then(() => dispatch(action))
          .catch(handleWsError);
        break;
      default:
        dispatch(action);
    }
  }

  return (
    <>
      <Layout isLoading={!chat.isReady}>
        <div className="flex flex-col h-full">
          <audio className="w-full mb-3" controls>
            <source src={config.radioUrl} type="audio/mpeg" />
          </audio>
          <ChatBox state={state} handle={handleEvent} />
        </div>
      </Layout>
    </>
  );
}
