import React, { PropsWithChildren } from 'react';

export default function Layout({
  children,
  banner,
  isAdmin = false,
}: PropsWithChildren & {
  banner?: React.ReactNode;
  isAdmin?: boolean;
}) {
  return (
    <>
      {!isAdmin ? (
        <div className="flex flex-col h-full flex-wrap">
          <div className="bg-green-800 text-white">
            <div className="mx-auto p-5 flex max-w-md">
              <div className="font-bold">Hermes MP3</div>
            </div>
          </div>
          {banner}
          <div className={'mx-auto p-4 flex-grow w-full md:max-w-md'}>
            {children}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="bg-green-800 text-white">
            <div className="mx-auto p-5 flex container">
              <div className="font-bold">Hermes MP3 Administrare</div>
            </div>
          </div>
          {banner}
          <div className="mx-auto p-4 flex-grow min-h-0 container">
            {children}
          </div>
        </div>
      )}
    </>
  );
}
