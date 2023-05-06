import { PropsWithChildren, Ref, useEffect, useRef, useState } from 'react';
import { ChatMessage, ChatRoom } from '../types/chatMessage';
import NicknameBadge from './NicknameBadge';
import Input from './ui/Input';
import Button from './ui/Button';
import classNames from 'classnames';

function Tab({
  isSelected,
  onClick,
  children,
}: {
  isSelected: boolean;
  onClick: () => void;
} & PropsWithChildren) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        {
          'border border-b-transparent rounded-t': isSelected,
          'border border-transparent border-b-blue-500': !isSelected,
        },
        'border-blue-500 flex-grow text-center py-2 px-3',
      )}
    >
      {children}
    </button>
  );
}

export default function AdminChatBox({
  tab,
  messages,
  tabBadges,
  nickname,
  onTab,
  onParticipantsMessage,
  onAdminMessage,
}: {
  tab: ChatRoom;
  messages: [ChatMessage[], ChatMessage[]]; // participants, then admins
  tabBadges: [number, number];
  nickname: React.ReactNode;
  onTab?: (tab: ChatRoom) => void;
  onParticipantsMessage?: (text: string) => void;
  onAdminMessage?: (text: string) => void;
}) {
  return (
    <>
      <div className="flex">
        <Tab
          isSelected={tab === ChatRoom.participants}
          onClick={() => onTab?.(ChatRoom.participants)}
        >
          Participanți
          {tabBadges[0] !== 0 && (
            <span className="ml-2 bg-green-700 text-white rounded-full p-1 px-2">
              {tabBadges[0]}
            </span>
          )}
        </Tab>
        <Tab
          isSelected={tab === ChatRoom.volunteers}
          onClick={() => onTab?.(ChatRoom.volunteers)}
        >
          Hermes
          {tabBadges[1] !== 0 && (
            <span className="ml-2 bg-green-700 text-white rounded-full p-1 px-2">
              {tabBadges[1]}
            </span>
          )}
        </Tab>
      </div>
      <div className="border border-blue-500 border-t-0 flex-grow min-h-0 flex flex-col">
        {tab === ChatRoom.participants && (
          <ChatTab
            messages={messages[0]}
            nickname={nickname}
            onChatMessage={onParticipantsMessage}
          />
        )}
        {tab === ChatRoom.volunteers && (
          <ChatTab
            messages={messages[1]}
            nickname={nickname}
            onChatMessage={onAdminMessage}
          />
        )}
      </div>
    </>
  );
}

const ChatTab = ({
  messages,
  nickname,
  onChatMessage,
}: {
  messages: ChatMessage[];
  nickname: React.ReactNode;
  onChatMessage?: (text: string) => void;
}) => {
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSendMessage = () => {
    setText('');
    onChatMessage?.(text);
  };

  return (
    <>
      <div className="border-b border-blue-500 py-3 flex-grow min-h-0 overflow-y-auto">
        <div className="overflow-y-auto break-words">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                'px-4 ' +
                (message.session?.isAdmin ? 'py-2 bg-blue-200' : 'py-1')
              }
            >
              <NicknameBadge
                isAdmin={!!message.session?.isAdmin}
                color={message.session?.color}
              >
                {message.session?.nickname ?? '???'}
              </NicknameBadge>
              : {message.text}
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>
      </div>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSendMessage();
        }}
        className="p-3 px-4 flex gap-2 items-center"
      >
        <label>{nickname}</label>
        <Input
          className="flex-grow"
          type="text"
          value={text}
          onChange={(ev) => setText(ev.target.value)}
        ></Input>
        <Button type="submit">
          <i className="bi-send"></i>
        </Button>
      </form>
    </>
  );
};
