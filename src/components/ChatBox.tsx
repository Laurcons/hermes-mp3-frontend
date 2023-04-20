import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types/chatMessage';
import NicknameBadge from './NicknameBadge';

export default function ChatBox({
  messages,
  onSendMessage,
  onUpdateNickname,
  noNick = false,
}: {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onUpdateNickname?: (nickname: string) => void;
  noNick?: boolean;
}) {
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nickname, setNickname] = useState('');
  const [hasNick, setHasNick] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  function sendMessage() {
    onSendMessage(text);
    setText('');
  }

  function handleNickname() {
    onUpdateNickname!(nickname);
    setHasNick(true);
  }

  return (
    <>
      <div className="border border-blue-500 flex-grow min-h-0 flex flex-col">
        <div className="border-b border-blue-500 p-3 px-4">
          Conversație live
        </div>
        <div className="border-b border-blue-500 py-3 flex-grow overflow-y-auto min-h-0">
          {messages.map((message) => (
            <div
              key={message._id}
              className={
                'px-4 ' +
                (message.session?.isAdmin ? 'py-2 bg-blue-200' : 'py-1')
              }
            >
              <NicknameBadge
                isAdmin={!!message.session?.isAdmin}
                color={'#' + message.sessionId.substring(0, 6)}
              >
                {message.session?.nickname ?? '???'}
              </NicknameBadge>
              : {message.text}
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>
        <div className="p-3 px-4 flex gap-2 justify-center">
          {(hasNick || noNick) && (
            <>
              <label>
                {noNick ? (
                  <NicknameBadge isAdmin={true}>Hermes</NicknameBadge>
                ) : (
                  <NicknameBadge isAdmin={false}>{nickname}</NicknameBadge>
                )}
                :
              </label>
              <input
                className="border flex-grow p-1"
                type="text"
                value={text}
                onChange={(ev) => setText(ev.target.value)}
                onKeyUp={(ev) => ev.key === 'Enter' && sendMessage()}
              ></input>
            </>
          )}
          {!hasNick && !noNick && (
            <>
              <label className="grow-[1]">
                Introdu un pseudonim pentru a scrie in chat:
              </label>
              <div className="grow-[2]">
                <input
                  className="border p-1"
                  type="text"
                  value={nickname}
                  onChange={(ev) => setNickname(ev.target.value)}
                  onKeyUp={(ev) => ev.key === 'Enter' && handleNickname()}
                ></input>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
