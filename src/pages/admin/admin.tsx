import { Circle, MapContainer, Polyline, TileLayer } from 'react-leaflet';
import Layout from '../../components/Layout';
import useAdminWs from '../../lib/ws/useAdminWs';
import { AdminWsContext, createAdminWs } from '../../lib/ws-contexts';
import { useCallback, useState } from 'react';
import useLocationHistory from '../../lib/useLocationHistory';
import ChatBox from '../../components/ChatBox';
import { LocationEvent } from '../../types/locationEvent';
import { ChatMessage } from '../../types/chatMessage';

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [globalLocationTrackingPercent, setGlobalLocationTrackingPercent] =
    useState(0);

  const ws = useAdminWs({
    events: {
      'locations-update': useCallback(
        (batch: LocationEvent[]) =>
          batch.forEach(locations.handleLocationEvent),
        [locations],
      ),
      // no usecallback needed, setState function is stable
      'global-location-tracking-percent': setGlobalLocationTrackingPercent,
      'chat-message': useCallback(
        (msg: ChatMessage) => {
          setMessages((msgs) => [...msgs, msg]);
        },
        [messages],
      ),
    },
  });

  return (
    <Layout isAdmin={true}>
      <div className="flex w-full h-full gap-4">
        <div className="flex-1 flex flex-col">
          <ChatBox
            messages={messages}
            noNick={true}
            onSendMessage={ws.sendChatMessage}
          />
        </div>
        <div className="flex-1 relative">
          <MapContainer
            className="w-full h-full"
            center={[46.770316077554774, 23.59139834817552]}
            zoom={14}
          >
            <TileLayer
              attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ${Math.floor(
                globalLocationTrackingPercent * 100,
              )}% participanti au locatia pornita`}
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.history.map((session) => (
              <>
                {
                  <Circle
                    center={[
                      session.locations[0].lat,
                      session.locations[0].lon,
                    ]}
                    radius={session.locations[0].acc}
                    stroke={false}
                    color={'#' + session.sessionId.substring(0, 6)}
                  />
                }
                <Polyline
                  key={session.sessionId}
                  positions={session.locations.map((loc) => [loc.lat, loc.lon])}
                  pathOptions={{
                    color: '#' + session.sessionId.substring(0, 6),
                    weight: 2,
                  }}
                />
              </>
            ))}
          </MapContainer>
        </div>
      </div>
    </Layout>
  );
}
