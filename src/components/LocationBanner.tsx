import { useState } from 'react';

export default function LocationBanner({
  isTracking,
  onTrackingUpdate,
}: {
  isTracking: boolean;
  onTrackingUpdate: (newVal: boolean) => void;
}) {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <div className="bg-blue-200">
      <div className="mx-auto max-w-md p-3">
        {isHidden && (
          <div className="text-center">
            <button
              className="underline text-blue-900"
              onClick={() => {
                setIsHidden(false), onTrackingUpdate(true);
              }}
            >
              Doresc să ajut cu locația mea live
            </button>
          </div>
        )}
        {!isTracking && !isHidden && (
          <>
            <div className="mb-2">
              Ne-ar ajuta enorm dacă ai partaja live locația ta cu noi,
              organizatorii. Noi vom vedea un singur punct anonim pe hartă. Îți
              mulțumim că ne ajuți să organizăm evenimentul!
            </div>
            <div className="flex justify-between">
              <button
                className="bg-slate-800 text-white p-2 px-3 rounded"
                onClick={() => onTrackingUpdate(true)}
              >
                Sunt de acord!
              </button>
              <button
                className="font-thin italic underline text-blue-700"
                onClick={() => setIsHidden(true)}
              >
                Nu doresc
              </button>
            </div>
          </>
        )}
        {isTracking && (
          <>
            <div className="mb-2">
              Îți mulțumim că partajezi locația ta live cu noi!
              <br />
              <button
                className="font-thin italic underline text-blue-700"
                onClick={() => onTrackingUpdate(false)}
              >
                Nu mai doresc partajarea live
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
