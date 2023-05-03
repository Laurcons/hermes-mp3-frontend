import { Circle, MapContainer, Polyline, TileLayer } from 'react-leaflet';
import Layout from '../../components/Layout';
import useAdminWs from '../../lib/ws/useAdminWs';
import {
  AdminWsContext,
  VolunteerWsContext,
  createAdminWs,
  createVolunteerWs,
} from '../../lib/ws-contexts';
import { useCallback, useState } from 'react';
import useLocationHistory from '../../lib/useLocationHistory';
import { LocationEvent } from '../../types/locationEvent';
import { ChatMessage, ChatRoom } from '../../types/chatMessage';
import { StatusEvent } from '@/types/statusEvent';
import AdminChatBox from '@/components/AdminChatBox';
import useVolunteerWs from '@/lib/ws/useVolunteerWs';
import { config } from '@/lib/config';
import NicknameBadge from '@/components/NicknameBadge';
import { Session } from '@/types/session';

export default function VolunteerPage() {
  const ws = createVolunteerWs();
  return (
    <VolunteerWsContext.Provider value={ws}>
      <WrappedVolunteerPage />
    </VolunteerWsContext.Provider>
  );
}

function WrappedVolunteerPage() {
  const [participantMessages, setParticipantMessages] = useState<ChatMessage[]>(
    [],
  );
  const [adminMessages, setAdminMessages] = useState<ChatMessage[]>([]);
  const [tab, setTab] = useState<ChatRoom>(ChatRoom.volunteers);
  const [tabBadges, setTabBadges] = useState<[number, number]>([0, 0]);
  const [session, setSession] = useState<Session | null>(null);

  const ws = useVolunteerWs({
    events: {
      'chat-message': useCallback((msg: ChatMessage) => {
        if (msg.room === ChatRoom.participants) {
          setParticipantMessages((msgs) => [...msgs, msg]);
          if (tab !== ChatRoom.participants)
            setTabBadges((bad) => [bad[0] + 1, bad[1]]);
        } else if (msg.room === ChatRoom.volunteers) {
          setAdminMessages((msgs) => [...msgs, msg]);
          if (tab !== ChatRoom.volunteers)
            setTabBadges((bad) => [bad[0], bad[1] + 1]);
        }
      }, []),
      user: setSession,
    },
  });

  const handleTab = (tab: ChatRoom) => {
    setTab(tab);
    if (tab === ChatRoom.participants) {
      setTabBadges((bad) => [0, bad[1]]);
    } else if (tab === ChatRoom.volunteers) {
      setTabBadges((bad) => [bad[0], 0]);
    }
  };

  return (
    <Layout isAdmin={false} isLoading={!ws.isConnected}>
      <div className="flex-1 flex flex-col gap-3 h-full">
        <audio className="w-full flex-shrink-0 mb-3" controls>
          <source src={config.radioUrl} type="audio/mpeg" />
        </audio>
        <div className="flex flex-grow min-h-0 flex-col">
          <AdminChatBox
            messages={[participantMessages, adminMessages]}
            nickname={
              <NicknameBadge
                isAdmin={false}
                color={'#' + session?.id.substring(0, 6)}
              >
                {session?.user?.username}
              </NicknameBadge>
            }
            tab={tab}
            tabBadges={tabBadges}
            onTab={handleTab}
            onParticipantsMessage={(text) =>
              ws.sendChatMessage('participants', text)
            }
            onAdminMessage={(text) => ws.sendChatMessage('volunteers', text)}
          />
        </div>
      </div>
    </Layout>
  );
}
