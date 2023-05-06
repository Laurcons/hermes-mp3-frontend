import { Circle, MapContainer, Polyline, TileLayer } from 'react-leaflet';
import Layout from '../../components/Layout';
import useAdminWs from '../../lib/ws/useAdminWs';
import { AdminWsContext, createAdminWs } from '../../lib/ws-contexts';
import { useCallback, useState } from 'react';
import useLocationHistory from '../../lib/useLocationHistory';
import UserChatBox from '../../components/UserChatBox';
import { LocationEvent } from '../../types/locationEvent';
import { ChatMessage, ChatRoom } from '../../types/chatMessage';
import { StatusEvent } from '@/types/statusEvent';
import AdminChatBox from '@/components/AdminChatBox';
import NicknameBadge from '@/components/NicknameBadge';
import { SessionRole } from '@/types/session';
import dayjs from 'dayjs';

export default function AdminPage() {
  const ws = createAdminWs();
  return (
    <AdminWsContext.Provider value={ws}>
      <WrappedAdminPage />
    </AdminWsContext.Provider>
  );
}

function WrappedAdminPage() {
  const locations = useLocationHistory();
  const [participantMessages, setParticipantMessages] = useState<ChatMessage[]>(
    [],
  );
  const [adminMessages, setAdminMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<StatusEvent | null>();
  const [tab, setTab] = useState<ChatRoom>(ChatRoom.participants);
  const [tabBadges, setTabBadges] = useState<[number, number]>([0, 0]);

  const ws = useAdminWs({
    events: {
      connect: useCallback(() => {
        setAdminMessages([]);
        setParticipantMessages([]);
        setStatus(null);
      }, []),
      'locations-update': useCallback(
        (batch: LocationEvent[]) =>
          batch.forEach(locations.handleLocationEvent),
        [locations],
      ),
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
      status: setStatus,
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
    <Layout isAdmin={true} isLoading={!ws.isConnected}>
      <div className="flex w-full h-full gap-4">
        <div className="flex-1 flex flex-col gap-3 min-h-0 min-w-0">
          {status && (
            <div className="border border-green-400 rounded p-2 px-3">
              <h1 className="font-bold">Status eveniment</h1>
              <div className="flex flex-wrap gap-4">
                <span>Participanți: {status.sessions.activeParticipants}</span>
                <span>Locații: {status.sessions.activeTrackings}</span>
              </div>
            </div>
          )}
          <div className="flex flex-grow min-h-0 flex-col">
            <AdminChatBox
              messages={[participantMessages, adminMessages]}
              nickname={<NicknameBadge isAdmin={true} />}
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
        <div className="flex-1 relative">
          <MapContainer
            className="w-full h-full"
            center={[46.76202001148841, 23.579933643043965]}
            zoom={18}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.locations.map((location) => (
              <>
                {
                  <Circle
                    center={[location.lat, location.lon]}
                    radius={5}
                    stroke={true}
                    fillColor={location.session.color}
                    color={
                      dayjs().diff(location.timestamp, 'minutes') > 5
                        ? ''
                        : location.session.role === SessionRole.participant
                        ? 'blue'
                        : 'green'
                    }
                  />
                }
              </>
            ))}
          </MapContainer>
        </div>
      </div>
    </Layout>
  );
}
