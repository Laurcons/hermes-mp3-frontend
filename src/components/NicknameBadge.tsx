import { PropsWithChildren } from 'react';
import { getReadableTextForBg } from '../lib/utils';

export default function NicknameBadge({
  children, // the nickname
  isAdmin,
  color,
}: PropsWithChildren & {
  isAdmin: boolean;
  color?: string;
}) {
  return (
    <>
      {isAdmin && (
        <span className="bg-red-200 border border-red-800 rounded px-1">
          Hermes
        </span>
      )}
      {!isAdmin && (
        <span
          className="rounded px-1"
          style={{
            backgroundColor: color,
            color: color ? getReadableTextForBg(color) : 'black',
          }}
        >
          {children}
        </span>
      )}
    </>
  );
}
