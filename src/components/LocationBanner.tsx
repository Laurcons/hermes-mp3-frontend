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
              Doresc sa ajut cu locatia mea live
            </button>
          </div>
        )}
        {!isTracking && !isHidden && (
          <>
            <div className="mb-2">
              Ne-ar ajuta enorm daca ai partaja live locatia ta cu noi,
              organizatorii. Noi vom vedea un singur punct anonim pe harta. Iti
              multumim ca ne ajuti sa organizam evenimentul!
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
              Iti multumim ca partajezi locatia ta live cu noi!
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
