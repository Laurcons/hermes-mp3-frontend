import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { UserWsContext, createUserWs } from '../lib/ws-contexts';
import useUserWs from '../lib/ws/useUserWs';
import LocationBanner from '../components/LocationBanner';
import ChatBox from '../components/ChatBox';
import { ChatMessage } from '../types/chatMessage';
import { config } from '../lib/config';
import { handleWsError } from '../lib/ws/common';

export default function ChatPage() {
  const ws = createUserWs();
  return (
    <UserWsContext.Provider value={ws}>
      <WrappedChatPage />
    </UserWsContext.Provider>
  );
}

function WrappedChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLocationTracking, setIsLocationTracking] = useState(false);

  const chat = useUserWs({
    events: {
      'chat-message': useCallback(
        (msg: ChatMessage) => {
          setMessages((msgs) => [...msgs, msg]);
        },
        [messages],
      ),
      'location-tracking': setIsLocationTracking,
    },
    withLocationTracking: isLocationTracking,
  });

  function sendText(text: string) {
    chat.sendChatMessage(text).catch(handleWsError());
  }

  function updateNick(nickname: string) {
    chat.updateNickname(nickname);
  }

  return (
    <>
      <Layout isLoading={!chat.isReady}>
        <div className="flex flex-col h-full">
          <audio className="w-full mb-3" controls>
            <source src={config.radioUrl} type="audio/mpeg" />
          </audio>
          <ChatBox
            messages={messages}
            onSendMessage={sendText}
            onUpdateNickname={updateNick}
          />
        </div>
      </Layout>
    </>
  );
}
