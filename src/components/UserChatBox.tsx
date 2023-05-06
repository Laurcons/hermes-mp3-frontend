import { PropsWithChildren, Ref, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types/chatMessage';
import NicknameBadge from './NicknameBadge';
import Input from './ui/Input';
import Button from './ui/Button';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import A from './ui/A';
import { Session } from '@/types/session';

interface ChatBoxState {
  messages: ChatMessage[];
  nickname: string;
  tab: 'chat' | 'settings';
  chatBadgeCount: number;
  session: Session | null;
}

export type ChatBoxAction =
  | { type: 'send-chat-message'; text: string }
  | { type: 'set-nickname'; nickname: string }
  | { type: 'set-tab'; tab: 'chat' | 'settings' };

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

export default function UserChatBox({
  state,
  handle,
}: {
  state: ChatBoxState;
  handle: (action: ChatBoxAction) => void;
}) {
  return (
    <>
      <div className="flex">
        <Tab
          isSelected={state.tab === 'chat'}
          onClick={() => handle({ type: 'set-tab', tab: 'chat' })}
        >
          Chat live
          {state.chatBadgeCount !== 0 && (
            <span className="ml-2 bg-green-700 text-white rounded-full p-1 px-2">
              {state.chatBadgeCount}
            </span>
          )}
        </Tab>
        {state.nickname && (
          <Tab
            isSelected={state.tab === 'settings'}
            onClick={() => handle({ type: 'set-tab', tab: 'settings' })}
          >
            Opțiuni
          </Tab>
        )}
      </div>
      <div className="border border-blue-500 border-t-0 flex-grow min-h-0 flex flex-col">
        {state.tab === 'chat' && <ChatTab state={state} handle={handle} />}
        {state.tab === 'settings' && (
          <SettingsTab state={state} handle={handle} />
        )}
      </div>
    </>
  );
}

const ChatTab = ({
  state,
  handle,
}: {
  state: ChatBoxState;
  handle: (action: ChatBoxAction) => void;
}) => {
  const [text, setText] = useState('');
  const [nickname, setNickname] = useState(''); // this is the value in the actual text field, `state` contains the "true" value
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [state.messages]);

  const handleSendMessage = () => {
    if (text.trim().length === 0) return;
    if (text.length > 1024) return;
    setText('');
    handle({ type: 'send-chat-message', text });
  };

  return (
    <>
      <div className="border-b border-blue-500 py-3 flex-grow min-h-0 overflow-y-auto">
        <div className="overflow-y-auto break-words">
          {state.messages.map((message) => (
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
          if (!state.nickname) handle({ type: 'set-nickname', nickname });
          else handleSendMessage();
        }}
        className="p-3 px-4 flex gap-2 items-center"
      >
        {state.nickname && (
          <div className="flex flex-col gap-1 flex-grow">
            <div className="flex gap-2 items-center">
              <label>
                <NicknameBadge isAdmin={false} color={state.session?.color}>
                  {state.nickname}
                </NicknameBadge>
              </label>
              <Input
                className="flex-grow"
                type="text"
                value={text}
                onChange={(ev) => setText(ev.target.value)}
              ></Input>
              <Button type="submit">
                <i className="bi-send"></i>
              </Button>
            </div>
            {text.length > 1024 && (
              <div className="text-sm text-red-400">
                Ai depășit limita de 1024 de caractere
              </div>
            )}
          </div>
        )}
        {!state.nickname && (
          <>
            <Input
              className="flex-grow"
              type="text"
              value={nickname}
              placeholder="Pseudonimul tău"
              onChange={(ev) => setNickname(ev.target.value)}
              required
            ></Input>
            <Button type="submit">Mai departe!</Button>
          </>
        )}
      </form>
    </>
  );
};

const SettingsTab = ({
  state,
  handle,
}: {
  state: ChatBoxState;
  handle: (action: ChatBoxAction) => void;
}) => {
  const [nickname, setNickname] = useState(state.nickname); // this is the value in the actual text field, `state` contains the "true" value
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="p-2 px-3 flex-grow overflow-y-auto">
      <form
        className="mb-3"
        onSubmit={(ev) => {
          ev.preventDefault();
          handle({ type: 'set-nickname', nickname });
        }}
      >
        <label>Pseudonimul tău</label>
        <div className="flex gap-3">
          <Input
            type="text"
            value={nickname}
            onChange={(ev) => setNickname(ev.target.value)}
          />
          <Button type="submit">Schimbă</Button>
        </div>
      </form>
      <button
        className="text-blue-500 mb-3 block"
        onClick={() => setIsAboutOpen((o) => !o)}
      >
        Despre activitate
      </button>
      {isAboutOpen && (
        <>
          <p>
            MP3 Experience activitate marca{' '}
            <A href="https://societatea-hermes.ro">Societatea Hermes</A>;
          </p>
          <p>
            Aplicație dezvoltată de{' '}
            <A href="https://laurcons.ro" target="_blank">
              Laurențiu Pricop / Bubu
            </A>
            ;
          </p>
          <div className="mb-3"></div>
          <p className="mb-2">
            Ai aspirații de web development? De ce nu îți începi cariera cu 200$
            gratuiți pe hostul acestei aplicații, DigitalOcean?{' '}
            <A
              href="https://www.digitalocean.com/?refcode=72172f34b447&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"
              target="_blank"
            >
              Află mai multe
            </A>
          </p>
        </>
      )}
      <A
        href="https://www.digitalocean.com/?refcode=72172f34b447&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"
        target="_blank"
        noExternalIcon={true}
      >
        <img
          src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg"
          alt="DigitalOcean Referral Badge"
        />
      </A>
    </div>
  );
};
